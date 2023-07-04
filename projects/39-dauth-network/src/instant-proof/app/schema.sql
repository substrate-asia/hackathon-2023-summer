create database dapi_ip;
use dapi_ip;


drop table if exists account;
create table account (
    acc_hash varchar(128),
    acc_seal varchar(512),
    auth_type varchar(20),
    id_type varchar(20),
    PRIMARY KEY(acc_hash, auth_type)
)
ROW_FORMAT=COMPRESSED
CHARACTER set = utf8mb4;


drop table if exists auth;
create table auth (
    id BIGINT NOT NULL AUTO_INCREMENT,
    acc_hash varchar(128),
    auth_type varchar(20),
    id_type varchar(20),
    acc_auth_seq int not null,  /* auth seq or nonce */
    audience varchar(128), /* client_name*/
    auth_datetime datetime,
    auth_exp BIGINT,
    request_id varchar(64),
    INDEX i_date using btree(auth_datetime),
    INDEX i_account using hash(acc_hash),
    PRIMARY KEY(id)
)
ROW_FORMAT=COMPRESSED
CHARACTER set = utf8mb4;


create database dclient;
use dclient;

drop table if exists client;
create table client (
    client_name varchar(128),
    client_origin varchar(128), 
    client_id varchar(32),
    client_secret_hash varchar(128),
    client_redirect_url varchar(256),
    mail_subject varchar(128),
    mail_text_template text,
    mail_html_template text,
    PRIMARY KEY(client_name)
)
ROW_FORMAT=COMPRESSED
CHARACTER set = utf8mb4;


drop user 'duadmin'@'localhost';
drop user 'duadmin';
flush privileges;
create user 'duadmin'@'localhost' identified by 'ks123';
create user 'duadmin'@'%' identified by 'ks123';
grant all on dapi.* to 'duadmin'@'localhost';
grant all on dapi.* to 'duadmin'@'%';
grant all on dclient.* to 'duadmin'@'localhost';
grant all on dclient.* to 'duadmin'@'%';
flush privileges;


create user 'dcadmin'@'localhost' identified by 'ks123';
create user 'dcadmin'@'%' identified by 'ks123';
grant all on dclient.* to 'duadmin'@'localhost';
grant all on dclient.* to 'duadmin'@'%';
flush privileges;
