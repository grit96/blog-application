import TagAPI from '../lib/tag';


const tests = (t) => {
  t.test('tag.all error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.getTags = (cb) => {
      st.pass('db.getTags is called');
      cb({code: 'ER_ERROR'}, null);
    };

    api.all((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.all no tags', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.getTags = (cb) => {
      st.pass('db.getTags is called');
      cb(null, []);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tags, [], 'empty tags array');
      st.end();
    });
  });

  t.test('tag.all success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tags = [{id: 1, name: 'tag1'},
                  {id: 2, name: 'tag2'}];

    st.plan(3);

    db.getTags = (cb) => {
      st.pass('db.getTags is called');
      cb(null, tags);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tags, tags, 'correct tags array');
      st.end();
    });
  });

  t.test('tag.get invalid tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.getTag = (tag_id, cb) => {
      st.fail('db.getTag should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getTag = (id, cb) => {
      st.pass('db.getTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get tag not found', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.getTag = (id, cb) => {
      st.pass('db.getTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Tag not found', 'correct error message');
      st.end();
    });
  });

  t.test('tag.get success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {id: 1, name: 'tag1'};

    st.plan(4);

    db.getTag = (id, cb) => {
      st.pass('db.getTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, tag);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.tag, tag, 'correct tag object');
      st.end();
    });
  });

  t.test('tag.create error', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {name: 'tag1'};

    st.plan(4);

    db.createTag = (obj, cb) => {
      st.pass('db.createTag is called');
      st.deepEqual(obj, tag, 'correct object passed in');
      cb({code: 'ER_ERROR'}, null);
    };

    api.create(tag, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.create tag already exists', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {name: 'tag1'};

    st.plan(4);

    db.createTag = (obj, cb) => {
      st.pass('db.createTag is called');
      st.deepEqual(obj, tag, 'correct object passed in');
      cb({code: 'ER_DUP_ENTRY'}, null);
    };

    api.create(tag, (code, data) => {
      st.equal(code, 409, 'correct status code');
      st.equal(data.err, 'Tag already exists', 'correct error message');
      st.end();
    });
  });

  t.test('tag.create validation fails', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {};

    st.plan(2);

    db.createTag = (obj, cb) => {
      st.fail('db.createTag should not be called');
      st.end();
    };

    api.create(tag, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag name', 'correct error message');
      st.end();
    });
  });

  t.test('tag.create success', (st) => {
    const db = {}, api = new TagAPI(db);

    const tag = {name: 'tag1'};

    st.plan(4);

    db.createTag = (obj, cb) => {
      st.pass('db.createTag is called');
      st.deepEqual(obj, tag, 'correct tag object');
      cb(null, 1);
    };

    api.create(tag, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.id, 1, 'correct tag ID');
      st.end();
    });
  });

  t.test('tag.delete invalid Tag ID', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(2);

    db.deleteTag = (id, cb) => {
      st.fail('db.deleteTag should not be called');
      st.end();
    };

    api.delete(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid tag ID', 'correct error message');
      st.end();
    });
  });

  t.test('tag.delete error', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.deleteTag = (id, cb) => {
      st.pass('db.deleteTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.delete(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('tag.delete tag not found', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(4);

    db.deleteTag = (id, cb) => {
      st.pass('db.deleteTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, {affectedRows: 0});
    };

    api.delete(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Tag not found', 'correct error message');
      st.end();
    });
  });

  t.test('tag.delete success', (st) => {
    const db = {}, api = new TagAPI(db);

    st.plan(3);

    db.deleteTag = (id, cb) => {
      st.pass('db.deleteTag is called');
      st.equal(id, 1, 'correct tag ID');
      cb(null, {affectedRows: 1});
    };

    api.delete(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.end();
    });
  });
};


export default tests;
