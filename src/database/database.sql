CREATE TABLE `USERS`
(
    `ID`            INT          NOT NULL AUTO_INCREMENT UNIQUE,
    `FIRST_NAME`    VARCHAR(50),
    `LAST_NAME`     VARCHAR(50),
    `EMAIL`         VARCHAR(50) NOT NULL,
    `PASSWORD`      VARCHAR(255) NOT NULL,
    `MOBILE_NUMBER` VARCHAR(12),
    `NIC`           VARCHAR(12),
    `ROLE`          ENUM ('ADMIN', 'USER', 'CUSTOMER') DEFAULT 'USER',
    `CREATED_ON`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `LETTERS`
(
    `ID`     INT          NOT NULL AUTO_INCREMENT UNIQUE,
    `LETTER` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `DAILY_TOKEN`
(
    `ID`        INT NOT NULL AUTO_INCREMENT UNIQUE,
    `LETTER_ID` INT NOT NULL,
    `QUANTITY`  INT NOT NULL,
    `PRICE`     INT NOT NULL,
    `DATE`      DATE,
    PRIMARY KEY (`ID`)
);

CREATE TABLE `INVOICE`
(
    `ID`            INT          NOT NULL AUTO_INCREMENT UNIQUE,
    `USER_ID`       INT,
    `MOBILE_NUMBER` VARCHAR(12) NOT NULL,
    `NAME`          VARCHAR(50),
    `CREATED_AT`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`ID`)
);

CREATE TABLE `INVOICE_TOKEN`
(
    `ID`         INT NOT NULL AUTO_INCREMENT UNIQUE,
    `INVOICE_ID` INT NOT NULL,
    `TOKEN_ID`   INT NOT NULL,
    `QUANTITY`   INT,
    PRIMARY KEY (`ID`)
);

ALTER TABLE `LETTERS`
    ADD FOREIGN KEY (`ID`) REFERENCES `DAILY_TOKEN` (`LETTER_ID`)
        ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `USERS`
    ADD FOREIGN KEY (`ID`) REFERENCES `INVOICE` (`USER_ID`)
        ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `INVOICE`
    ADD FOREIGN KEY (`ID`) REFERENCES `INVOICE_TOKEN` (`INVOICE_ID`)
        ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `DAILY_TOKEN`
    ADD FOREIGN KEY (`ID`) REFERENCES `INVOICE_TOKEN` (`TOKEN_ID`)
        ON UPDATE NO ACTION ON DELETE NO ACTION;