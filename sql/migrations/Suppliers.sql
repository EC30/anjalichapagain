CREATE TABLE IF NOT EXISTS Suppliers(
    SupplierID SERIAL PRIMARY KEY,
    SupplierName VARCHAR(50) NOT NULL,
    ContactName VARCHAR(50),
	Address VARCHAR(50) NOT NULL,
	City VARCHAR(50) NOT NULL,
	PostalCode VARCHAR(10),
	Country VARCHAR(50) NOT NULL,
	Phone VARCHAR(20)
);





