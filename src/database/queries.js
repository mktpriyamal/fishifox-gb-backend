const { DB_NAME } = require('../utils/secrets');

// Database management queries
const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;
const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

// Users table queries
const createTableUsers = `
    CREATE TABLE IF NOT EXISTS USERS
    (
        ID            INT                                NOT NULL AUTO_INCREMENT UNIQUE,
        FIRST_NAME    VARCHAR(50),
        LAST_NAME     VARCHAR(50),
        EMAIL         VARCHAR(50)                        NOT NULL,
        PASSWORD      VARCHAR(255)                       NOT NULL,
        MOBILE_NUMBER VARCHAR(12),
        NIC           VARCHAR(12),
        ROLE          ENUM ('ADMIN', 'USER', 'CUSTOMER') NOT NULL,
        CREATED_ON    TIMESTAMP(6)                       NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (ID)
    )
`;

const createNewUser = `
    INSERT INTO USERS (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD, MOBILE_NUMBER, NIC, ROLE, CREATED_ON)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
    SELECT *
    FROM USERS
    WHERE EMAIL = ?
`;

const findUserByNic = `
    SELECT *
    FROM USERS
    WHERE NIC = ?
`;

// Letters table queries
const createTableLetters = `
    CREATE TABLE IF NOT EXISTS LETTERS
    (
        ID     INT          NOT NULL AUTO_INCREMENT UNIQUE,
        LETTER VARCHAR(255) NOT NULL,
        PRIMARY KEY (ID)
    )
`;

const createNewLetter = `
    INSERT INTO LETTERS (LETTER)
    VALUES (?)
`;

const getAllLetters = `
    SELECT * FROM LETTERS
`;

const findLetterById = `
    SELECT *
    FROM LETTERS
    WHERE ID = ?
`;

const updateLetter = `
    UPDATE LETTERS
    SET LETTER = ?
    WHERE ID = ?
`;

const deleteLetter = `
  DELETE FROM LETTERS
  WHERE ID = ?
`;

// DailyToken table queries
const createTableDailyToken = `
    CREATE TABLE IF NOT EXISTS DAILY_TOKEN
    (
        ID        INT NOT NULL AUTO_INCREMENT UNIQUE,
        LETTER_ID INT NOT NULL,
        QUANTITY  INT NOT NULL,
        PRICE     INT NOT NULL,
        DATE      DATE,
        PRIMARY KEY (ID),
        INDEX (LETTER_ID)
    )
`;

const addForeignKeyDailyToken = `
    ALTER TABLE DAILY_TOKEN
        ADD FOREIGN KEY (LETTER_ID) REFERENCES LETTERS (ID)
            ON UPDATE NO ACTION ON DELETE NO ACTION
`;

const findDailyTokensByDate = `
    SELECT * 
    FROM DAILY_TOKEN 
    WHERE DATE = ?
`;

const createNewDailyToken = `
    INSERT INTO DAILY_TOKEN (LETTER_ID, QUANTITY, PRICE, DATE)
    VALUES (?, ?, ?, ?)
`;

const findDailyTokenById = `
    SELECT *
    FROM DAILY_TOKEN
    WHERE ID = ?
`;

const updateDailyToken = `
  UPDATE DAILY_TOKEN
  SET LETTER_ID = ?, QUANTITY = ?, PRICE = ?, DATE = ?
  WHERE ID = ?
`;

const deleteDailyToken = `
  DELETE FROM DAILY_TOKEN
  WHERE ID = ?
`;

const findAvailableTokensByDate = `
    SELECT
        DT.ID AS tokenId,
        DT.DATE AS tokenDate,
        DT.QUANTITY AS totalQuantity,
        DT.PRICE AS price,
        L.ID AS letterId,
        L.LETTER AS letter,
        DT.QUANTITY - COALESCE(SUM(IT.QUANTITY),0) AS availableQuantity
    FROM DAILY_TOKEN DT
             LEFT JOIN LETTERS L on L.ID = DT.LETTER_ID
             LEFT JOIN INVOICE_TOKEN IT ON DT.ID = IT.TOKEN_ID
    WHERE DATE=? GROUP BY DT.ID
`;


// Invoice table queries
const createTableInvoice = `
    CREATE TABLE IF NOT EXISTS INVOICE
    (
        ID            INT          NOT NULL AUTO_INCREMENT UNIQUE,
        USER_ID       INT,
        MOBILE_NUMBER VARCHAR(12)  NOT NULL,
        NAME          VARCHAR(50),
        CREATED_AT    TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (ID),
        INDEX (USER_ID)
    )
`;

const addForeignKeyInvoice = `
    ALTER TABLE INVOICE
        ADD FOREIGN KEY (USER_ID) REFERENCES USERS (ID)
            ON UPDATE NO ACTION ON DELETE NO ACTION
`;

const createInvoice = `
    INSERT INTO INVOICE (USER_ID, MOBILE_NUMBER, NAME, CREATED_AT)
    VALUES (?, ?, ?, NOW())
`;

const getAllInvoicesQuery = `
    SELECT 
        I.ID,
        I.USER_ID,
        I.MOBILE_NUMBER,
        I.NAME,
        T.TOKEN_ID,
        T.QUANTITY
    FROM
        INVOICE I
    LEFT JOIN 
        INVOICE_TOKEN T ON I.ID = T.INVOICE_ID;
`;

const findInvoiceById = `
    SELECT i.*, it.TOKEN_ID, it.QUANTITY
    FROM INVOICE i
             LEFT JOIN INVOICE_TOKEN it ON i.ID = it.INVOICE_ID
    WHERE i.ID = ?
`;

const updateInvoice = `
    UPDATE INVOICE 
    SET USER_ID = ?, MOBILE_NUMBER = ?, NAME = ? 
    WHERE ID = ?
`;

const deleteInvoice = `
    DELETE FROM INVOICE 
    WHERE ID = ?
`;

const removeInvoiceToken = `
    DELETE FROM INVOICE_TOKEN 
    WHERE INVOICE_ID = ?
`;

// InvoiceToken table queries
const createTableInvoiceToken = `
    CREATE TABLE IF NOT EXISTS INVOICE_TOKEN
    (
        ID         INT NOT NULL AUTO_INCREMENT UNIQUE,
        INVOICE_ID INT NOT NULL,
        TOKEN_ID   INT NOT NULL,
        QUANTITY   INT,
        PRIMARY KEY (ID),
        INDEX (INVOICE_ID),
        INDEX (TOKEN_ID)
    )
`;

const addForeignKeyInvoiceToken = `
    ALTER TABLE INVOICE_TOKEN
        ADD FOREIGN KEY (INVOICE_ID) REFERENCES INVOICE (ID)
            ON UPDATE NO ACTION ON DELETE NO ACTION
`;

const addForeignKeyDailyTokenToken = `
    ALTER TABLE INVOICE_TOKEN
        ADD FOREIGN KEY (TOKEN_ID) REFERENCES DAILY_TOKEN (ID)
            ON UPDATE NO ACTION ON DELETE NO ACTION
`;

const createInvoiceToken = `
    INSERT INTO INVOICE_TOKEN (INVOICE_ID, TOKEN_ID, QUANTITY)
    VALUES (?, ?, ?)
`;

const findInvoiceTokenById = `
    SELECT *
    FROM INVOICE_TOKEN
    WHERE ID = ?
`;

const addForeignKeyLetters = 'ALTER TABLE DAILY_TOKEN ADD FOREIGN KEY (LETTER_ID) REFERENCES LETTERS (ID) ON UPDATE NO ACTION ON DELETE NO ACTION';

const addForeignKeyUsers = 'ALTER TABLE INVOICE ADD FOREIGN KEY (USER_ID) REFERENCES USERS (ID) ON UPDATE NO ACTION ON DELETE NO ACTION';

module.exports = {
    // Database management queries
    createDB,
    dropDB,

    // Users table queries
    createTableUsers,
    addForeignKeyUsers,
    createNewUser,
    findUserByEmail,
    findUserByNic,

    // Letters table queries
    createTableLetters,
    addForeignKeyLetters,
    createNewLetter,
    getAllLetters,
    findLetterById,
    updateLetter,
    deleteLetter,

    // DailyToken table queries
    createTableDailyToken,
    addForeignKeyDailyToken,
    findDailyTokensByDate,
    createNewDailyToken,
    findDailyTokenById,
    updateDailyToken,
    deleteDailyToken,
    findAvailableTokensByDate,

    // Invoice table queries
    createTableInvoice,
    addForeignKeyInvoice,
    getAllInvoicesQuery,
    createInvoice,
    findInvoiceById,
    updateInvoice,
    deleteInvoice,
    removeInvoiceToken,


    // InvoiceToken table queries
    createTableInvoiceToken,
    addForeignKeyInvoiceToken,
    addForeignKeyDailyTokenToken,
    createInvoiceToken,
    findInvoiceTokenById,
};
