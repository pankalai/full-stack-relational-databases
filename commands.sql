create table blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes INTEGER DEFAULT 0);

insert into blogs (author, url, title) values ('Some Blogger', 'www.someblog.com', 'A blog');
insert into blogs (author, url, title, likes) values ('Another Blogger', 'www.anotherblog.com', 'Another blog', 10);