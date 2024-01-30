describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3003/api/testing/reset');

		// create new users
		cy.request('POST', 'http://localhost:3003/api/users', {
			username: 'cy_user',
			name: 'Cypress Tester',
			password: 'secret',
		});
		cy.request('POST', 'http://localhost:3003/api/users', {
			username: 'cy_user_second',
			name: 'Cypress Tester 2',
			password: 'secret',
		});

		cy.visit('http://localhost:5173');
	});

	it('Login form is shown', function () {
		cy.contains('log in to application');
		cy.get('input#username').should('exist');
		cy.get('input#password').should('exist');
		cy.contains('login');
	});

	describe('Login', function () {
		it('succeeds with correct credentials', function () {
			cy.get('input#username').type('cy_user');
			cy.get('input#password').type('secret');
			cy.contains('login').click();
			cy.contains('Cypress Tester logged in');
		});

		it('fails with wrong credentials', function () {
			cy.get('input#username').type('cy_user');
			cy.get('input#password').type('wrong-secret');
			cy.contains('login').click();
			cy.get('.error')
				.should('contain', 'Wrong username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
				.and('have.css', 'border-style', 'solid');

			cy.get('html').should('not.contain', 'Cypress Tester logged in');
		});
	});

	describe('When logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'cy_user', password: 'secret' });
		});

		it('user can create a blog', function () {
			cy.contains('new blog').click();
			cy.get('input#title').type('a title created by cypress');
			cy.get('input#author').type('an author created by cypress');
			cy.get('input#url').type('a url created by cypress');
			cy.get('button[type=submit]').click();

			cy.contains(
				'Blog created successfully: a title created by cypress an author created by cypress'
			);
			cy.get('.blogs-list').contains(
				'a title created by cypress an author created by cypress'
			);
		});

		describe('and a blog exists', function () {
			beforeEach(function () {
				const blogData = {
					title: 'a title created by cypress',
					url: 'a url created by cypress',
					author: 'an author created by cypress',
				};
				cy.createBlog(blogData);
			});

			it('a blog can be liked', function () {
				cy.get('.blogs-list')
					.contains('a title created by cypress')
					.as('singleBlog');

				cy.get('@singleBlog').contains('show').click();
				cy.get('@singleBlog').get('[data-cy=btn-like]').click();

				cy.get('@singleBlog').contains('likes 1');
			});

			it('user who created a blog can delete it', function () {
				cy.on('window:alert', (txt) => {
					expect(txt).to.contains('Remove blog');

					cy.on('window:confirm', () => true);
				});

				cy.get('.blogs-list')
					.contains('a title created by cypress')
					.as('singleBlog');

				cy.get('@singleBlog').contains('show').click();
				cy.get('@singleBlog').get('[data-cy=btn-delete]').click();
			});

			it('only the creator can see the delete button of a blog', function () {
				cy.createBlog({
					title: 'lorem blog title',
					url: 'lorem blog url',
					author: 'lorem blog author',
				});
				cy.contains('logout').click();
				cy.login({ username: 'cy_user_second', password: 'secret' });

				cy.get('.blogs-list').contains('lorem blog title').as('singleBlog');

				cy.get('@singleBlog').contains('show').click();
				cy.get('@singleBlog').get('[data-cy=btn-delete]').should('not.exist');
			});

			it('the blogs are ordered according to likes with the blog with the most likes being first', function () {
				cy.createBlog({
					title: 'blog with 7 likes',
					url: 'lorem blog url',
					author: 'lorem blog author',
					likes: 7,
				});
				cy.createBlog({
					title: 'blog with 2 likes',
					url: 'lorem blog url',
					author: 'lorem blog author',
					likes: 2,
				});
				cy.createBlog({
					title: 'blog with 4 likes',
					url: 'lorem blog url',
					author: 'lorem blog author',
					likes: 4,
				});

				cy.get('.blog').eq(0).should('contain', 'blog with 7 likes');
				cy.get('.blog').eq(1).should('contain', 'blog with 4 likes');
				cy.get('.blog').eq(2).should('contain', 'blog with 2 likes');
			});
		});
	});
});
