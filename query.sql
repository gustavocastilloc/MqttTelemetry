use telemetry;
CREATE TABLE Temperatura (
    tempID int NOT NULL AUTO_INCREMENT,
    temperatura float,
    fecha datetime default now(),
    PRIMARY KEY (tempID)
);
use telemetry;
insert into Temperatura (temperatura, fecha)values(26.7,now());
use telemetry;
select * from Temperatura;
use telemetry;
create user 'gustavocastillo' IDENTIFIED WITH mysql_native_password BY 'mqtt96';
grant all privileges on *.* TO 'gustavocastillo';
flush privileges;
