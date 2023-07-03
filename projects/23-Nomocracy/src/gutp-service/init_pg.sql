CREATE TABLE gutpuser (
    id TEXT PRIMARY KEY,
    account TEXT NOT NULL,
    nickname TEXT NOT NULL,
    avatar TEXT NOT NULL,
    role SMALLINT NOT NULL,
    status SMALLINT NOT NULL,
    signup_time BIGINT NOT NULL,
    pub_settings TEXT NOT NULL,
    ext TEXT NOT NULL
);
CREATE TABLE gutpuser_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutpsubspace (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    banner TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    profession TEXT NOT NULL,
    appid TEXT NOT NULL,
    is_public BOOLEAN NOT NULL,
    status SMALLINT NOT NULL,
    weight SMALLINT NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutpsubspace_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutppost (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    subspace_id TEXT NOT NULL,
    extlink TEXT NOT NULL,
    profession TEXT NOT NULL,
    appid TEXT NOT NULL,
    is_public BOOLEAN NOT NULL,
    status SMALLINT NOT NULL,
    weight SMALLINT NOT NULL,
    created_time BIGINT NOT NULL,
    updated_time BIGINT NOT NULL
);
CREATE TABLE gutppost_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutpcomment (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    parent_comment_id TEXT,
    is_public BOOLEAN NOT NULL,
    status SMALLINT NOT NULL,
    weight INTEGER NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutpcomment_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutptag (
    id TEXT PRIMARY KEY,
    caption TEXT NOT NULL,
    subspace_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    is_subspace_tag BOOLEAN NOT NULL,
    is_public BOOLEAN NOT NULL,
    weight SMALLINT NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutptag_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutpposttag (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutpposttag_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutppostdiff (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL,
    diff TEXT NOT NULL,
    version_num INTEGER NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutppostdiff_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutpmoderator (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    is_subspace_moderator BOOLEAN NOT NULL,
    subspace_id TEXT,
    tag_id TEXT,
    permission_level SMALLINT NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutpmoderator_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);

CREATE TABLE gutpextobj (
    id TEXT PRIMARY KEY,
    caption TEXT NOT NULL,
    content TEXT NOT NULL,
    subspace_id TEXT,
    tag_id TEXT,
    creator_id TEXT NOT NULL,
    is_subspace_ext BOOLEAN NOT NULL,
    weight SMALLINT NOT NULL,
    created_time BIGINT NOT NULL
);
CREATE TABLE gutpextobj_idhash (
	id varchar PRIMARY KEY,
	hash varchar NOT NULL
);