import AuthorAPI from '../lib/author';


const tests = (t) => {
  t.test('author.all error', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(3);

    db.getAuthors = (cb) => {
      st.pass('db.getAuthors is called');
      cb({code: 'ER_ERROR'}, null);
    };

    api.all((code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('author.all no authors', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(3);

    db.getAuthors = (cb) => {
      st.pass('db.getAuthors is called');
      cb(null, []);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.equal(data.authors.length, 0, 'empty authors array');
      st.end();
    });
  });

  t.test('author.all success', (st) => {
    const db = {}, api = new AuthorAPI(db);

    const authors = [{id: 1, name: 'Fred Bloggs', email: 'fred.bloggs@mail.com'},
                     {id: 2, name: 'Bib Smoth', email: 'bib.smoth@mail.com'},
                     {id: 3, name: 'Jim Stevens', email: 'jim.stevens@mail.com'}];

    st.plan(3);

    db.getAuthors = (cb) => {
      st.pass('db.getAuthors is called');
      cb(null, authors);
    };

    api.all((code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.authors, authors, 'correct authors array');
      st.end();
    });
  });

  t.test('author.get error', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(4);

    db.getAuthor = (id, cb) => {
      st.pass('db.getAuthor is called');
      st.equal(id, 1, 'correct author ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('author.get invalid author ID', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(2);

    db.getAuthor = (id, cb) => {
      st.fail('db.getAuthor should not be called');
      st.end();
    };

    api.get(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid author ID', 'correct error message');
      st.end();
    });
  });

  t.test('author.get author not found', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(4);

    db.getAuthor = (id, cb) => {
      st.pass('db.getAuthor is called');
      st.equal(id, 1, 'correct author ID');
      cb(null, null);
    };

    api.get(1, (code, data) => {
      st.equal(code, 404, 'correct status code');
      st.equal(data.err, 'Author not found', 'correct error message');
      st.end();
    });
  });

  t.test('author.get success', (st) => {
    const db = {}, api = new AuthorAPI(db);

    const author = {id: 1, name: 'Fred Bloggs', email: 'fred.bloggs@mail.com'};

    st.plan(4);

    db.getAuthor = (id, cb) => {
      st.pass('db.getAuthor is called');
      st.equal(id, 1, 'correct author ID');
      cb(null, author);
    };

    api.get(1, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.author, author, 'correct author object');
      st.end();
    });
  });

  t.test('author.getArticles error', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(4);

    db.getArticlesByAuthor = (id, cb) => {
      st.pass('db.getArticlesByAuthor is called');
      st.equal(id, 1, 'correct author ID');
      cb({code: 'ER_ERROR'}, null);
    };

    api.getArticles(1, (code, data) => {
      st.equal(code, 500, 'correct status code');
      st.equal(data.err, 'Server error', 'correct error message');
      st.end();
    });
  });

  t.test('author.getArticles invalid author ID', (st) => {
    const db = {}, api = new AuthorAPI(db);

    st.plan(2);

    db.getArticlesByAuthor = (id, cb) => {
      st.fail('db.getArticlesByAuthor should not be called');
      st.end();
    };

    api.getArticles(null, (code, data) => {
      st.equal(code, 400, 'correct status code');
      st.equal(data.err, 'Invalid author ID', 'correct error message');
      st.end();
    });
  });

  t.test('author.getArticles success', (st) => {
    const db = {}, api = new AuthorAPI(db);

    const articles = [{id: 1, author_id: 20, title: 'Some title', content: 'Lorem Ipsum Dolor', tags: [{id: 7, name: 'truth'}, {id: 15, name: 'cool'}]},
                      {id: 3, author_id: 20, title: 'Some title 2', content: 'Very serious text', tags: [{id: 7, name: 'truth'}]}];

    st.plan(4);

    db.getArticlesByAuthor = (id, cb) => {
      st.pass('db.getArticlesByAuthor is called');
      st.equal(id, 7, 'correct author ID');
      cb(null, articles);
    };

    api.getArticles(7, (code, data) => {
      st.equal(code, 200, 'correct status code');
      st.deepEqual(data.articles, articles, 'correct articles object');
      st.end();
    });
  });
}


export default tests;
