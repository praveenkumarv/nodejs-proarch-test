CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) CHARACTER SET latin1 NOT NULL,
  `password` varchar(45) CHARACTER SET latin1 NOT NULL,
  `email` varchar(255) CHARACTER SET latin1 NOT NULL,
  `firstname` varchar(45) CHARACTER SET latin1 NOT NULL,
  `lastname` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `skills` text CHARACTER SET latin1,
  `country` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `updatedOn` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;