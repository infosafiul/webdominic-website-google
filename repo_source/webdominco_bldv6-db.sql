-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: webdominco_bldv6-db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `webdominco_bldv6-db`
--


--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `admin_user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entity_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `entity_id` bigint unsigned DEFAULT NULL,
  `details_json` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_created` (`created_at`),
  KEY `idx_audit_entity` (`entity_type`,`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_rate_limits`
--

DROP TABLE IF EXISTS `auth_rate_limits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_rate_limits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `identifier` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempts` int unsigned NOT NULL DEFAULT '0',
  `window_started_at` datetime NOT NULL,
  `blocked_until` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_auth_identifier` (`identifier`),
  KEY `idx_auth_ip` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_rate_limits`
--

LOCK TABLES `auth_rate_limits` WRITE;
/*!40000 ALTER TABLE `auth_rate_limits` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_rate_limits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `balance_transactions`
--

DROP TABLE IF EXISTS `balance_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `balance_transactions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_balance_user` (`user_id`,`created_at`),
  KEY `idx_balance_type` (`type`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balance_transactions`
--

LOCK TABLES `balance_transactions` WRITE;
/*!40000 ALTER TABLE `balance_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `balance_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `communication_log`
--

DROP TABLE IF EXISTS `communication_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `communication_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `admin_user_id` bigint unsigned DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `service_id` bigint unsigned DEFAULT NULL,
  `channel` enum('email','portal') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'portal',
  `direction` enum('outbound','inbound','system') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'system',
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comm_user` (`user_id`,`created_at`),
  KEY `idx_comm_order` (`order_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communication_log`
--

LOCK TABLES `communication_log` WRITE;
/*!40000 ALTER TABLE `communication_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `communication_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_hosting_requests`
--

DROP TABLE IF EXISTS `custom_hosting_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_hosting_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `domain_name` varchar(253) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_storage_gb` decimal(12,2) NOT NULL DEFAULT '0.00',
  `requested_transfer_gb` decimal(12,2) DEFAULT NULL,
  `bandwidth_mode` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requested_websites` int DEFAULT NULL,
  `requested_mailboxes` int DEFAULT NULL,
  `control_panel` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `management_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'managed',
  `billing_cycle` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `budget_amount` decimal(12,2) DEFAULT NULL,
  `budget_currency` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requirements` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'submitted',
  `admin_note` text COLLATE utf8mb4_unicode_ci,
  `quoted_price` decimal(12,2) DEFAULT NULL,
  `quoted_currency` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quoted_product_name` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quoted_at` datetime DEFAULT NULL,
  `converted_order_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_custom_hosting_user` (`user_id`,`created_at`),
  KEY `idx_custom_hosting_status` (`status`,`created_at`),
  KEY `idx_custom_hosting_order` (`converted_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_hosting_requests`
--

LOCK TABLES `custom_hosting_requests` WRITE;
/*!40000 ALTER TABLE `custom_hosting_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `custom_hosting_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_services`
--

DROP TABLE IF EXISTS `customer_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `service_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain_name` varchar(253) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_reference` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `login_password_enc` text COLLATE utf8mb4_unicode_ci,
  `email_login_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_username` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_password_enc` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `activated_at` datetime DEFAULT NULL,
  `last_credential_update_at` datetime DEFAULT NULL,
  `expires_at` date DEFAULT NULL,
  `renewal_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `renewal_currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BDT',
  `renewal_cycle` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'yearly',
  `notes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_service_user` (`user_id`),
  KEY `idx_service_product` (`product_id`),
  KEY `idx_service_status_expiry` (`status`,`expires_at`),
  KEY `idx_service_lifecycle` (`status`,`expires_at`,`user_id`),
  KEY `idx_service_type` (`service_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_services`
--

LOCK TABLES `customer_services` WRITE;
/*!40000 ALTER TABLE `customer_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_pricing`
--

DROP TABLE IF EXISTS `domain_pricing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domain_pricing` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tld` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `hosting_bundle_price` decimal(10,2) DEFAULT NULL,
  `hosting_website_bundle_price` decimal(10,2) DEFAULT NULL,
  `renewal_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `transfer_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BDT',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_domain_tld` (`tld`),
  KEY `idx_domain_active_sort` (`active`,`sort_order`),
  KEY `idx_domain_category` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_pricing`
--

LOCK TABLES `domain_pricing` WRITE;
/*!40000 ALTER TABLE `domain_pricing` DISABLE KEYS */;
INSERT INTO `domain_pricing` (`id`, `tld`, `registration_price`, `hosting_bundle_price`, `hosting_website_bundle_price`, `renewal_price`, `transfer_price`, `currency`, `description`, `category`, `active`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'.com',1749.00,1649.00,874.50,1749.00,1749.00,'BDT','Commercial / Business','popular',1,1,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(2,'.net',1949.00,1849.00,974.50,1949.00,1949.00,'BDT','Network','popular',1,2,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(3,'.org',1486.00,1386.00,743.00,1486.00,1486.00,'BDT','Organization','popular',1,3,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(4,'.info',724.00,624.00,362.00,724.00,724.00,'BDT','Information','popular',1,5,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(5,'.biz',1111.00,1011.00,555.50,1111.00,1111.00,'BDT','Business','popular',1,4,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(6,'.shop',324.00,224.00,162.00,324.00,324.00,'BDT','Online Shop','ecommerce',1,50,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(7,'.xyz',890.00,790.00,445.00,890.00,890.00,'BDT','Modern and trendy extension',NULL,1,7,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(8,'.co',2436.00,2336.00,1218.00,2436.00,2436.00,'BDT','Colombia / Global Business','country',1,87,'2026-08-29 06:42:02','2026-09-03 23:18:17'),(9,'.me',386.00,286.00,193.00,386.00,386.00,'BDT','Personal','popular',1,6,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(10,'.cc',1511.00,1411.00,755.50,1511.00,1511.00,'BDT','General / Alternative','popular',1,7,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(16,'.company',1824.00,1724.00,912.00,1824.00,1824.00,'BDT','Company','business',1,10,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(17,'.business',1699.00,1599.00,849.50,1699.00,1699.00,'BDT','Business','business',1,11,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(18,'.agency',1036.00,936.00,518.00,1036.00,1036.00,'BDT','Agency','business',1,12,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(19,'.services',1111.00,1011.00,555.50,1111.00,1111.00,'BDT','Services','business',1,13,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(20,'.consulting',6411.00,6311.00,3205.50,6411.00,6411.00,'BDT','Consulting','business',1,14,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(21,'.solutions',3574.00,3474.00,1787.00,3574.00,3574.00,'BDT','Business Solutions','business',1,15,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(22,'.management',3199.00,3099.00,1599.50,3199.00,3199.00,'BDT','Management','business',1,16,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(23,'.finance',11824.00,11724.00,5912.00,11824.00,11824.00,'BDT','Finance','business',1,17,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(24,'.group',3449.00,3349.00,1724.50,3449.00,3449.00,'BDT','Business Group','business',1,18,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(25,'.marketing',4936.00,4836.00,2468.00,4936.00,4936.00,'BDT','Marketing','business',1,19,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(26,'.support',3199.00,3099.00,1599.50,3199.00,3199.00,'BDT','Support','business',1,20,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(27,'.international',1486.00,1386.00,743.00,1486.00,1486.00,'BDT','International','business',1,21,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(28,'.works',1036.00,936.00,518.00,1036.00,1036.00,'BDT','Creative Business','business',1,22,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(29,'.supply',3199.00,3099.00,1599.50,3199.00,3199.00,'BDT','Supply','business',1,23,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(30,'.partners',11824.00,11724.00,5912.00,11824.00,11824.00,'BDT','Business Partners','business',1,24,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(31,'.equipment',3199.00,3099.00,1599.50,3199.00,3199.00,'BDT','Equipment','business',1,25,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(32,'.domains',4936.00,4836.00,2468.00,4936.00,4936.00,'BDT','Domain Business','business',1,26,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(33,'.capital',11824.00,11724.00,5912.00,11824.00,11824.00,'BDT','Capital / Investment','business',1,27,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(34,'.tech',1450.00,1350.00,725.00,1450.00,1450.00,'BDT','Technology','technology',1,30,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(35,'.ai',12886.00,12786.00,6443.00,12886.00,12886.00,'BDT','Artificial Intelligence','technology',1,31,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(36,'.dev',2249.00,2149.00,1124.50,2249.00,2249.00,'BDT','Developer','technology',1,32,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(37,'.app',2499.00,2399.00,1249.50,2499.00,2499.00,'BDT','Application','technology',1,33,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(38,'.cloud',3524.00,3424.00,1762.00,3524.00,3524.00,'BDT','Cloud','technology',1,34,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(39,'.systems',2211.00,2111.00,1105.50,2211.00,2211.00,'BDT','Systems','technology',1,35,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(40,'.digital',449.00,349.00,224.50,449.00,449.00,'BDT','Digital','technology',1,36,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(41,'.technology',1111.00,1011.00,555.50,1111.00,1111.00,'BDT','Technology','technology',1,37,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(42,'.software',2011.00,1911.00,1005.50,2011.00,2011.00,'BDT','Software','technology',1,38,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(43,'.network',1049.00,949.00,524.50,1049.00,1049.00,'BDT','Network','technology',1,39,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(44,'.email',974.00,874.00,487.00,974.00,974.00,'BDT','Email','technology',1,40,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(45,'.center',1111.00,1011.00,555.50,1111.00,1111.00,'BDT','Center','technology',1,41,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(46,'.store',1263.00,1163.00,631.50,1263.00,1263.00,'BDT','Online Store','ecommerce',1,51,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(47,'.online',1074.00,974.00,537.00,1074.00,1074.00,'BDT','Online Business','ecommerce',1,52,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(48,'.site',950.00,850.00,475.00,950.00,950.00,'BDT','Website','ecommerce',1,53,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(49,'.space',574.00,474.00,287.00,574.00,574.00,'BDT','Space / Creative','ecommerce',1,54,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(50,'.live',511.00,411.00,255.50,511.00,511.00,'BDT','Live / Streaming','ecommerce',1,55,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(51,'.fun',574.00,474.00,287.00,574.00,574.00,'BDT','Fun / Entertainment','ecommerce',1,56,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(52,'.blog',3486.00,3386.00,1743.00,3486.00,3486.00,'BDT','Blog','ecommerce',1,57,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(53,'.pro',649.00,549.00,324.50,649.00,649.00,'BDT','Professional','ecommerce',1,58,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(54,'.vision',4936.00,4836.00,2468.00,4936.00,4936.00,'BDT','Vision / Creative','ecommerce',1,59,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(55,'.expert',6411.00,6311.00,3205.50,6411.00,6411.00,'BDT','Expert','ecommerce',1,60,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(57,'.academy',5086.00,4986.00,2543.00,5086.00,5086.00,'BDT','Academy','education',1,70,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(58,'.education',3761.00,3661.00,1880.50,3761.00,3761.00,'BDT','Education','education',1,71,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(59,'.university',11824.00,11724.00,5912.00,11824.00,11824.00,'BDT','University','education',1,72,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(60,'.institute',3199.00,3099.00,1599.50,3199.00,3199.00,'BDT','Institute','education',1,73,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(61,'.fr',1124.00,1024.00,562.00,1124.00,1124.00,'BDT','France','country',1,80,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(62,'.es',1124.00,1024.00,562.00,1124.00,1124.00,'BDT','Spain','country',1,81,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(63,'.nl',1449.00,1349.00,724.50,1449.00,1449.00,'BDT','Netherlands','country',1,82,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(64,'.eu',861.00,761.00,430.50,861.00,861.00,'BDT','European Union','country',1,83,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(65,'.de',1124.00,1024.00,562.00,1124.00,1124.00,'BDT','Germany','country',1,84,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(66,'.us',824.00,724.00,412.00,824.00,824.00,'BDT','United States','country',1,85,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(67,'.uk',1211.00,1111.00,605.50,1211.00,1211.00,'BDT','United Kingdom','country',1,86,'2026-09-02 23:44:29','2026-09-03 23:18:17'),(129,'.org.in',1549.00,1449.00,774.50,1549.00,1549.00,'BDT','Organization India','country-sub',1,90,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(130,'.co.in',1549.00,1449.00,774.50,1549.00,1549.00,'BDT','Commercial India','country-sub',1,91,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(131,'.in.net',574.00,474.00,287.00,574.00,574.00,'BDT','India Network','country-sub',1,92,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(132,'.co.uk',1211.00,1111.00,605.50,1211.00,1211.00,'BDT','UK Commercial','country-sub',1,93,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(133,'.com.au',1649.00,1549.00,824.50,1649.00,1649.00,'BDT','Australia Commercial','country-sub',1,94,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(134,'.com.br',1849.00,1749.00,924.50,1849.00,1849.00,'BDT','Brazil Commercial','country-sub',1,95,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(135,'.com.co',2786.00,2686.00,1393.00,2786.00,2786.00,'BDT','Colombia Commercial','country-sub',1,96,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(136,'.com.de',1474.00,1374.00,737.00,1474.00,1474.00,'BDT','Germany Commercial','country-sub',1,97,'2026-09-03 00:08:15','2026-09-03 23:18:17'),(137,'.com.mx',1911.00,1811.00,955.50,1911.00,1911.00,'BDT','Mexico Commercial','country-sub',1,98,'2026-09-03 00:08:15','2026-09-03 23:18:17');
/*!40000 ALTER TABLE `domain_pricing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_services`
--

DROP TABLE IF EXISTS `domain_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domain_services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_service_id` bigint unsigned NOT NULL,
  `registrar_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Manual Registrar',
  `registrar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `nameserver1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nameserver2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nameserver3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nameserver4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `auto_renew` tinyint(1) NOT NULL DEFAULT '0',
  `domain_lock` tinyint(1) NOT NULL DEFAULT '1',
  `epp_code_enc` text COLLATE utf8mb4_unicode_ci,
  `registrar_login_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `internal_purchase_reference` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `internal_notes_enc` text COLLATE utf8mb4_unicode_ci,
  `customer_notes` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_domain_service` (`customer_service_id`),
  KEY `idx_domain_expiry` (`expiry_date`),
  KEY `idx_domain_registrar` (`registrar_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_services`
--

LOCK TABLES `domain_services` WRITE;
/*!40000 ALTER TABLE `domain_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `domain_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain_transfer_requests`
--

DROP TABLE IF EXISTS `domain_transfer_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `domain_transfer_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `customer_service_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'requested',
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_domain_transfer_service` (`customer_service_id`),
  KEY `idx_domain_transfer_user` (`user_id`),
  KEY `idx_domain_transfer_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain_transfer_requests`
--

LOCK TABLES `domain_transfer_requests` WRITE;
/*!40000 ALTER TABLE `domain_transfer_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `domain_transfer_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_queue`
--

DROP TABLE IF EXISTS `email_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_queue` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `service_id` bigint unsigned DEFAULT NULL,
  `to_email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_type` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `status` enum('queued','sent','failed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'queued',
  `attempts` int unsigned NOT NULL DEFAULT '0',
  `last_error` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email_queue_status` (`status`,`created_at`),
  KEY `idx_email_queue_user` (`user_id`,`created_at`),
  KEY `idx_email_queue_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_queue`
--

LOCK TABLES `email_queue` WRITE;
/*!40000 ALTER TABLE `email_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fulfillment_notes`
--

DROP TABLE IF EXISTS `fulfillment_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fulfillment_notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `admin_user_id` bigint unsigned NOT NULL,
  `note_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'internal',
  `note_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fulfillment_order` (`order_id`),
  KEY `idx_fulfillment_admin` (`admin_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fulfillment_notes`
--

LOCK TABLES `fulfillment_notes` WRITE;
/*!40000 ALTER TABLE `fulfillment_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `fulfillment_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fund_requests`
--

DROP TABLE IF EXISTS `fund_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fund_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sender_number` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fund_user` (`user_id`),
  KEY `idx_fund_status` (`status`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fund_requests`
--

LOCK TABLES `fund_requests` WRITE;
/*!40000 ALTER TABLE `fund_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `fund_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `invoice_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BDT',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unpaid',
  `due_at` datetime DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_invoice_number` (`invoice_number`),
  UNIQUE KEY `uq_invoice_order` (`order_id`),
  KEY `idx_invoice_user` (`user_id`),
  KEY `idx_invoice_status` (`status`,`due_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_activity`
--

DROP TABLE IF EXISTS `login_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_activity` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `event_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_login_activity_user` (`user_id`,`created_at`),
  KEY `idx_login_activity_event` (`event_type`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_activity`
--

LOCK TABLES `login_activity` WRITE;
/*!40000 ALTER TABLE `login_activity` DISABLE KEYS */;
INSERT INTO `login_activity` (`id`, `user_id`, `event_type`, `ip_address`, `user_agent`, `created_at`) VALUES (1,1,'login_success','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0','2026-08-29 07:01:13'),(2,1,'login_success','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0','2026-08-29 10:18:57'),(3,1,'logout','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0','2026-08-29 10:58:40'),(4,1,'login_success','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:154.0) Gecko/20100101 Firefox/154.0','2026-09-01 08:11:39'),(5,1,'login_success','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0','2026-09-18 20:49:33'),(6,1,'logout','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0','2026-09-18 20:49:51'),(7,1,'login_success','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0','2026-09-18 21:32:26'),(8,1,'logout','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0','2026-09-18 21:33:15'),(9,1,'login_success','160.202.144.95','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0','2026-09-24 17:20:05');
/*!40000 ALTER TABLE `login_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unique_key` varchar(190) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_notifications_unique` (`unique_key`),
  KEY `idx_notifications_user` (`user_id`,`is_read`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_discounts`
--

DROP TABLE IF EXISTS `order_discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_discounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `admin_user_id` bigint unsigned NOT NULL,
  `discount_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'fixed',
  `discount_value` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_order_discount` (`order_id`),
  KEY `idx_discount_admin` (`admin_user_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_discounts`
--

LOCK TABLES `order_discounts` WRITE;
/*!40000 ALTER TABLE `order_discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `item_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `product_category` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `domain_name` varchar(253) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BDT',
  `billing_cycle` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_product` (`product_id`),
  KEY `idx_order_items_category` (`product_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BDT',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `fulfillment_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'awaiting_payment',
  `fulfillment_note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expected_delivery` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fulfillment_started_at` datetime DEFAULT NULL,
  `fulfillment_completed_at` datetime DEFAULT NULL,
  `customer_notified_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_order_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`,`created_at`),
  KEY `idx_orders_status` (`status`,`created_at`),
  KEY `idx_orders_fulfillment` (`fulfillment_status`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `method` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BDT',
  `transaction_id` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sender_number` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `admin_note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_order` (`order_id`,`created_at`),
  KEY `idx_payments_user` (`user_id`,`created_at`),
  KEY `idx_payments_status` (`status`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthly_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `yearly_price` decimal(12,2) DEFAULT NULL,
  `currency` char(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `features_json` json DEFAULT NULL,
  `badge` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_slug` (`slug`),
  KEY `idx_product_category_active` (`category`,`active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` (`id`, `category`, `slug`, `name`, `short_description`, `monthly_price`, `yearly_price`, `currency`, `features_json`, `badge`, `active`, `sort_order`, `created_at`, `updated_at`) VALUES (1,'hosting','basic-hosting','Basic Hosting','Perfect for small websites',299.00,3588.00,'BDT','[\"1 Website\", \"10 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(2,'hosting','standard-hosting','Standard Hosting','Ideal for small business websites',599.00,7188.00,'BDT','[\"1 Website\", \"50 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(3,'hosting','premium-hosting','Premium Hosting','Best for growing business websites',999.00,11880.00,'BDT','[\"1 Website\", \"100 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\"]',NULL,1,3,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(4,'hosting','business-hosting','Business Hosting','For larger business websites',1999.00,23988.00,'BDT','[\"1 Website\", \"200 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\"]',NULL,1,4,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(5,'vps','basic-vps','Basic VPS','Perfect for small websites and apps',5.00,60.00,'USD','[\"1 vCPU\", \"2 GB RAM\", \"40 GB SSD\", \"2 TB Transfer\", \"Root Access\", \"USA Data Center\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(6,'vps','business-vps','Business VPS','Ideal for growing businesses',17.00,204.00,'USD','[\"2 vCPU\", \"8 GB RAM\", \"160 GB SSD\", \"8 TB Transfer\", \"Root Access\", \"USA Data Center\"]','POPULAR',1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(7,'vps','professional-vps','Professional VPS','For resource intensive applications',35.00,420.00,'USD','[\"4 vCPU\", \"16 GB RAM\", \"320 GB SSD\", \"16 TB Transfer\", \"Root Access\", \"USA Data Center\"]',NULL,1,3,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(8,'vps','enterprise-vps','Enterprise VPS','For high traffic and mission critical systems',70.00,840.00,'USD','[\"8 vCPU\", \"32 GB RAM\", \"640 GB SSD\", \"32 TB Transfer\", \"Root Access\", \"USA Data Center\", \"Managed Eligible\"]',NULL,1,4,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(9,'dedicated','ds-entry','DS Entry','For small or medium businesses',195.00,2340.00,'USD','[\"Dedicated CPU Resources\", \"64 GB RAM\", \"2 TB NVMe\", \"Fair Bandwidth\", \"Dedicated IPv4\", \"USA Data Center\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(10,'dedicated','ds-performance','DS Performance','High performance computing',250.00,3000.00,'USD','[\"24 Core CPU Class\", \"128 GB RAM\", \"10 TB SATA + 12 TB SATA\", \"High Capacity Fair Bandwidth\", \"Dedicated IPv4\", \"NYC / USA\"]',NULL,1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(11,'dedicated','ds-business','DS Business','Powerful and reliable',315.00,3780.00,'USD','[\"28 Core Dual CPU Class\", \"128 GB RAM\", \"2 TB NVMe\", \"Fair Bandwidth\", \"Dedicated IPv4\", \"USA Data Center\"]',NULL,1,3,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(12,'dedicated','ds-enterprise','DS Enterprise','For large scale applications',365.00,4380.00,'USD','[\"32 Core Dual CPU Class\", \"256 GB RAM\", \"2 x 1 TB SSD\", \"Fair Bandwidth\", \"Dedicated IPv4\", \"USA Data Center\"]',NULL,1,4,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(13,'email','business-email-basic','Business Email Basic','Professional email for your business',199.00,2388.00,'BDT','[\"5 Mailboxes\", \"10 GB Storage\", \"Webmail Access\", \"Spam Protection\", \"Mobile Support\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(14,'email','business-email-pro','Business Email Pro','More storage and mailboxes for growing teams',499.00,5988.00,'BDT','[\"25 Mailboxes\", \"50 GB Storage\", \"Webmail Access\", \"Advanced Spam Protection\", \"Mobile Support\", \"Priority Support\"]','POPULAR',1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(15,'security','website-security','Website Security','Protect your website and business data',499.00,5988.00,'BDT','[\"Malware Monitoring\", \"Security Hardening\", \"Threat Alerts\", \"Firewall Protection\", \"Expert Support\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(16,'security','backup-recovery','Backup & Recovery','Reliable backups and disaster recovery support',399.00,4788.00,'BDT','[\"Daily Backups\", \"Offsite Storage\", \"Restore Support\", \"Retention Management\"]',NULL,1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(17,'service','wordpress-design','WordPress Website Design','Professional WordPress website design',5000.00,50000.00,'BDT','[\"Responsive Design\", \"WordPress Setup\", \"Modern UI\", \"Basic SEO\", \"Launch Support\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(18,'service','website-maintenance','Website Maintenance','Ongoing website updates and maintenance',1500.00,15000.00,'BDT','[\"Updates\", \"Backups\", \"Security Checks\", \"Bug Fixing\", \"Technical Support\"]',NULL,1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(19,'service','seo-service','SEO Optimization','On-page SEO and technical optimization',3000.00,30000.00,'BDT','[\"On-page SEO\", \"Technical SEO\", \"Meta Optimization\", \"Performance Review\", \"Reporting\"]',NULL,1,3,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(20,'hosting','hosting-1gb','1GB Hosting','For one small website',199.00,2388.00,'BDT','[\"1 Website\", \"1 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,101,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(21,'hosting','hosting-2gb','2GB Hosting','For small business websites',299.00,3588.00,'BDT','[\"1 Website\", \"2 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,102,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(22,'hosting','hosting-3gb','3GB Hosting','Balanced hosting for growing sites',399.00,4788.00,'BDT','[\"1 Website\", \"3 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,103,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(23,'hosting','hosting-5gb','5GB Hosting','A practical business starter',499.00,5988.00,'BDT','[\"1 Website\", \"5 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,104,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(24,'hosting','hosting-7gb','7GB Hosting','More room for business websites',699.00,8388.00,'BDT','[\"1 Website\", \"7 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\"]',NULL,1,105,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(25,'hosting','hosting-10gb','10GB Hosting','Ideal for growing business websites',990.00,11880.00,'BDT','[\"1 Website\", \"10 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\"]','MOST POPULAR',1,106,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(26,'hosting','hosting-15gb','15GB Hosting','For larger business websites',1290.00,15480.00,'BDT','[\"1 Website\", \"15 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\"]',NULL,1,107,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(27,'hosting','hosting-25gb','25GB Hosting','More storage for busy websites',1990.00,23880.00,'BDT','[\"1 Website\", \"25 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\"]',NULL,1,108,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(28,'hosting','hosting-50gb','50GB Hosting','Large business website storage',3490.00,41880.00,'BDT','[\"1 Website\", \"50 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\"]',NULL,1,109,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(29,'business_hosting','business-100gb','100GB Business Hosting','High-capacity hosting for larger websites',5990.00,71880.00,'BDT','[\"1 Website\", \"100 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\", \"Business Support\"]',NULL,1,110,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(30,'business_hosting','business-200gb','200GB Business Hosting','Extra-large capacity for business workloads',10990.00,131880.00,'BDT','[\"1 Website\", \"200 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\", \"Business Support\"]',NULL,1,111,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(31,'business_hosting','business-300gb','300GB Business Hosting','Enterprise-sized website storage',14990.00,179880.00,'BDT','[\"1 Website\", \"300 GB SSD/NVMe Storage\", \"Fair Bandwidth\", \"Free SSL Certificate\", \"cPanel / AAA Hosting\", \"Daily Backup\", \"Priority Support\", \"Business Support\", \"Custom Support\"]',NULL,1,112,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(32,'reseller','reseller-10','Reseller 10','For agencies and multiple websites',2490.00,29880.00,'BDT','[\"10 cPanel Accounts\", \"25 GB WHM Storage\", \"Fair Bandwidth\", \"WHM + cPanel\", \"Free SSL\", \"Daily Backup\", \"1 Account = 1 Website\"]',NULL,1,201,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(33,'reseller','reseller-25','Reseller 25','For growing website portfolios',4490.00,53880.00,'BDT','[\"25 cPanel Accounts\", \"50 GB WHM Storage\", \"Fair Bandwidth\", \"WHM + cPanel\", \"Free SSL\", \"Daily Backup\", \"1 Account = 1 Website\"]','POPULAR',1,202,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(34,'reseller','reseller-50','Reseller 50','For larger agencies and teams',7990.00,95880.00,'BDT','[\"50 cPanel Accounts\", \"100 GB WHM Storage\", \"High Capacity Fair Bandwidth\", \"WHM + cPanel\", \"Free SSL\", \"Daily Backup\", \"1 Account = 1 Website\"]',NULL,1,203,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(35,'reseller','reseller-100','Reseller 100','For serious resellers and agencies',12990.00,155880.00,'BDT','[\"100 cPanel Accounts\", \"200 GB WHM Storage\", \"High Capacity Fair Bandwidth\", \"WHM + cPanel\", \"Free SSL\", \"Daily Backup\", \"1 Account = 1 Website\"]',NULL,1,204,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(36,'reseller','reseller-200','Reseller 200','For high-volume reseller hosting',21990.00,263880.00,'BDT','[\"200 cPanel Accounts\", \"300 GB WHM Storage\", \"High Capacity Fair Bandwidth\", \"WHM + cPanel\", \"Free SSL\", \"Daily Backup\", \"1 Account = 1 Website\"]',NULL,1,205,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(37,'storage','backup-200gb','Backup Storage 200GB','Reliable offsite backup storage',5.00,60.00,'USD','[\"200 GB Storage\", \"1 TB Transfer\", \"FTP/SFTP\", \"Rsync\", \"DirectAdmin\"]',NULL,1,1,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(38,'storage','backup-1tb','Backup Storage 1TB','Reliable offsite backup storage',7.00,84.00,'USD','[\"1 TB Storage\", \"2 TB Transfer\", \"FTP/SFTP\", \"Rsync\", \"DirectAdmin\"]',NULL,1,2,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(39,'storage','backup-2tb','Backup Storage 2TB','Reliable offsite backup storage',12.00,144.00,'USD','[\"2 TB Storage\", \"5 TB Transfer\", \"FTP/SFTP\", \"Rsync\", \"DirectAdmin\"]',NULL,1,3,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(40,'storage','backup-4tb','Backup Storage 4TB','Reliable offsite backup storage',14.00,168.00,'USD','[\"4 TB Storage\", \"10 TB Transfer\", \"FTP/SFTP\", \"Rsync\", \"DirectAdmin\"]',NULL,1,4,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(41,'storage','backup-10tb','Backup Storage 10TB','Large backup and archive storage',35.00,420.00,'USD','[\"10 TB Storage\", \"15 TB Transfer\", \"FTP/SFTP\", \"Rsync\", \"DirectAdmin\"]',NULL,1,5,'2026-08-29 06:42:02','2026-08-29 06:42:02'),(42,'storage','backup-20tb','Backup Storage 20TB','High-capacity backup and archive storage',59.00,708.00,'USD','[\"20 TB Storage\", \"20 TB Transfer\", \"FTP/SFTP\", \"Rsync\", \"DirectAdmin\"]',NULL,1,6,'2026-08-29 06:42:02','2026-08-29 06:42:02');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provisioning_jobs`
--

DROP TABLE IF EXISTS `provisioning_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provisioning_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `order_item_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned NOT NULL,
  `service_id` bigint unsigned DEFAULT NULL,
  `job_type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'queued',
  `attempts` int NOT NULL DEFAULT '0',
  `external_reference` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `error_message` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fulfillment_mode` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `provider_purchase_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `provider_purchase_cost` decimal(12,2) DEFAULT NULL,
  `provider_order_reference` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fulfillment_note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ready_at` datetime DEFAULT NULL,
  `customer_notified_at` datetime DEFAULT NULL,
  `queued_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_prov_status` (`status`),
  KEY `idx_prov_order` (`order_id`),
  KEY `idx_prov_user` (`user_id`),
  KEY `idx_prov_item` (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provisioning_jobs`
--

LOCK TABLES `provisioning_jobs` WRITE;
/*!40000 ALTER TABLE `provisioning_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `provisioning_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'requested',
  `admin_note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_refund_order` (`order_id`),
  KEY `idx_refund_user` (`user_id`),
  KEY `idx_refund_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refunds`
--

LOCK TABLES `refunds` WRITE;
/*!40000 ALTER TABLE `refunds` DISABLE KEYS */;
/*!40000 ALTER TABLE `refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server_locations`
--

DROP TABLE IF EXISTS `server_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server_locations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `region` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flag` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_location_active` (`region`,`active`,`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_locations`
--

LOCK TABLES `server_locations` WRITE;
/*!40000 ALTER TABLE `server_locations` DISABLE KEYS */;
INSERT INTO `server_locations` (`id`, `region`, `country`, `city`, `flag`, `active`, `sort_order`, `created_at`) VALUES (1,'North America','United States','New York','🇺🇸',1,1,'2026-08-29 06:42:02'),(2,'North America','United States','Dallas','🇺🇸',1,2,'2026-08-29 06:42:02'),(3,'North America','United States','Los Angeles','🇺🇸',1,3,'2026-08-29 06:42:02'),(4,'Europe','Germany','Frankfurt','🇩🇪',1,10,'2026-08-29 06:42:02'),(5,'Europe','Netherlands','Amsterdam','🇳🇱',1,11,'2026-08-29 06:42:02'),(6,'Asia-Pacific','Singapore','Singapore','🇸🇬',1,20,'2026-08-29 06:42:02'),(7,'Asia-Pacific','India','Mumbai','🇮🇳',1,21,'2026-08-29 06:42:02'),(8,'Asia-Pacific','Japan','Tokyo','🇯🇵',1,22,'2026-08-29 06:42:02');
/*!40000 ALTER TABLE `server_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server_product_meta`
--

DROP TABLE IF EXISTS `server_product_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server_product_meta` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `provider_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'InterServer',
  `provider_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_package` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_package_id` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_cost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `markup_percent` decimal(6,2) NOT NULL DEFAULT '40.00',
  `management_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unmanaged',
  `delivery_time` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_id` bigint unsigned DEFAULT NULL,
  `secret_purchase_notes_enc` text COLLATE utf8mb4_unicode_ci,
  `internal_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_server_meta_product` (`product_id`),
  KEY `idx_server_location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_product_meta`
--

LOCK TABLES `server_product_meta` WRITE;
/*!40000 ALTER TABLE `server_product_meta` DISABLE KEYS */;
INSERT INTO `server_product_meta` (`id`, `product_id`, `provider_name`, `provider_url`, `provider_package`, `provider_package_id`, `provider_cost`, `markup_percent`, `management_type`, `delivery_time`, `location_id`, `secret_purchase_notes_enc`, `internal_status`, `updated_at`) VALUES (1,5,'InterServer','https://www.interserver.net/vps/','VPS slice/package',NULL,3.00,40.00,'unmanaged','3-5 hours',1,NULL,'active','2026-08-29 06:42:02'),(2,6,'InterServer','https://www.interserver.net/vps/','4-slice VPS reference',NULL,12.00,40.00,'unmanaged','3-5 hours',1,NULL,'active','2026-08-29 06:42:02'),(3,7,'InterServer','https://www.interserver.net/vps/','8-slice VPS reference',NULL,24.00,40.00,'managed','5-12 hours',1,NULL,'active','2026-08-29 06:42:02'),(4,8,'InterServer','https://www.interserver.net/vps/','16-slice VPS reference',NULL,48.00,40.00,'fully-managed','1-2 business days',1,NULL,'active','2026-08-29 06:42:02'),(5,9,'InterServer','https://www.interserver.net/dedicated/','Current dedicated inventory reference',NULL,139.00,40.00,'unmanaged','3-5 hours',1,NULL,'active','2026-08-29 06:42:02'),(6,10,'InterServer','https://www.interserver.net/dedicated/','Buy-It-Now reference',NULL,179.00,40.00,'unmanaged','3-5 hours',1,NULL,'active','2026-08-29 06:42:02'),(7,11,'InterServer','https://www.interserver.net/dedicated/','Buy-It-Now reference',NULL,223.00,40.00,'managed','5-12 hours',2,NULL,'active','2026-08-29 06:42:02'),(8,12,'InterServer','https://www.interserver.net/dedicated/','Buy-It-Now reference',NULL,260.00,40.00,'fully-managed','1-2 business days',3,NULL,'active','2026-08-29 06:42:02'),(9,37,'InterServer','https://www.interserver.net/storage/','Storage hosting reference',NULL,3.00,40.00,'unmanaged','2-5 hours',NULL,NULL,'active','2026-08-29 06:42:02'),(10,38,'InterServer','https://www.interserver.net/storage/','Storage hosting reference',NULL,3.00,40.00,'unmanaged','2-5 hours',NULL,NULL,'active','2026-08-29 06:42:02'),(11,39,'InterServer','https://www.interserver.net/storage/','Storage hosting reference',NULL,3.00,40.00,'unmanaged','2-5 hours',NULL,NULL,'active','2026-08-29 06:42:02'),(12,40,'InterServer','https://www.interserver.net/storage/','Storage hosting reference',NULL,3.00,40.00,'unmanaged','2-5 hours',NULL,NULL,'active','2026-08-29 06:42:02'),(13,41,'InterServer','https://www.interserver.net/storage/','Storage hosting reference',NULL,3.00,40.00,'unmanaged','2-5 hours',NULL,NULL,'active','2026-08-29 06:42:02'),(14,42,'InterServer','https://www.interserver.net/storage/','Storage hosting reference',NULL,3.00,40.00,'unmanaged','2-5 hours',NULL,NULL,'active','2026-08-29 06:42:02');
/*!40000 ALTER TABLE `server_product_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_credential_audit`
--

DROP TABLE IF EXISTS `service_credential_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_credential_audit` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `service_id` bigint unsigned NOT NULL,
  `admin_user_id` bigint unsigned NOT NULL,
  `changed_fields` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_service_audit` (`service_id`,`created_at`),
  KEY `idx_service_audit_admin` (`admin_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_credential_audit`
--

LOCK TABLES `service_credential_audit` WRITE;
/*!40000 ALTER TABLE `service_credential_audit` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_credential_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_lifecycle_log`
--

DROP TABLE IF EXISTS `service_lifecycle_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_lifecycle_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `service_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` date NOT NULL,
  `details` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_service_lifecycle_event` (`service_id`,`event_type`,`event_date`),
  KEY `idx_lifecycle_user` (`user_id`,`created_at`),
  KEY `idx_lifecycle_type` (`event_type`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_lifecycle_log`
--

LOCK TABLES `service_lifecycle_log` WRITE;
/*!40000 ALTER TABLE `service_lifecycle_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_lifecycle_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `updated_by` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_site_setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `is_public`, `updated_by`, `created_at`, `updated_at`) VALUES (1,'business_name','WDH - Web Data Hosting','text',1,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(2,'support_email','support@wdhdomain.com','email',1,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(3,'support_phone','+88-01841440202','text',1,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(4,'default_server_markup','40','number',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(5,'default_service_currency','BDT','text',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(6,'manual_fulfillment_enabled','1','boolean',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(7,'domain_api_mode','demo','text',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(8,'maintenance_mode','0','boolean',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(9,'live_chat_provider','tawk','text',1,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(10,'live_chat_property_id','','text',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(11,'live_chat_widget_id','','text',0,1,'2026-08-29 06:42:02','2026-08-29 07:31:12'),(12,'live_chat_enabled','0','boolean',1,1,'2026-08-29 06:42:02','2026-08-29 07:31:12');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_ticket_attachments`
--

DROP TABLE IF EXISTS `support_ticket_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_ticket_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `message_id` bigint unsigned DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `admin_id` bigint unsigned DEFAULT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stored_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint unsigned NOT NULL,
  `sha256` char(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_attachments` (`ticket_id`,`created_at`),
  KEY `idx_attachment_message` (`message_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_ticket_attachments`
--

LOCK TABLES `support_ticket_attachments` WRITE;
/*!40000 ALTER TABLE `support_ticket_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_ticket_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_ticket_events`
--

DROP TABLE IF EXISTS `support_ticket_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_ticket_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `actor_user_id` bigint unsigned DEFAULT NULL,
  `actor_admin_id` bigint unsigned DEFAULT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_events` (`ticket_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_ticket_events`
--

LOCK TABLES `support_ticket_events` WRITE;
/*!40000 ALTER TABLE `support_ticket_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_ticket_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_ticket_messages`
--

DROP TABLE IF EXISTS `support_ticket_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_ticket_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint unsigned NOT NULL,
  `sender_user_id` bigint unsigned DEFAULT NULL,
  `sender_admin_id` bigint unsigned DEFAULT NULL,
  `sender_role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_internal` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket_messages` (`ticket_id`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_ticket_messages`
--

LOCK TABLES `support_ticket_messages` WRITE;
/*!40000 ALTER TABLE `support_ticket_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_ticket_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_tickets`
--

DROP TABLE IF EXISTS `support_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_tickets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ticket_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `service_id` bigint unsigned DEFAULT NULL,
  `order_id` bigint unsigned DEFAULT NULL,
  `category` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `assigned_admin_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `closed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ticket_number` (`ticket_number`),
  KEY `idx_ticket_user` (`user_id`,`updated_at`),
  KEY `idx_ticket_status` (`status`,`priority`,`updated_at`),
  KEY `idx_ticket_service` (`service_id`),
  KEY `idx_ticket_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_tickets`
--

LOCK TABLES `support_tickets` WRITE;
/*!40000 ALTER TABLE `support_tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `support_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
  `account_balance` decimal(12,2) NOT NULL DEFAULT '0.00',
  `last_login_at` datetime DEFAULT NULL,
  `last_login_ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `role`, `account_balance`, `last_login_at`, `last_login_ip`, `created_at`, `updated_at`) VALUES (1,'admin@wdhdomain.com','$2y$10$kzL2T2dmbK6GehT43UxkLu5gnCT1xvaDfl2dTAaHHAepJ0cxC/Cwe','Muhammad Safiul Azam','admin',0.00,'2026-09-24 23:20:05','160.202.144.95','2026-08-29 06:57:54','2026-09-24 17:20:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wdh_schema_version`
--

DROP TABLE IF EXISTS `wdh_schema_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wdh_schema_version` (
  `id` tinyint unsigned NOT NULL,
  `version_label` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wdh_schema_version`
--

LOCK TABLES `wdh_schema_version` WRITE;
/*!40000 ALTER TABLE `wdh_schema_version` DISABLE KEYS */;
INSERT INTO `wdh_schema_version` (`id`, `version_label`, `installed_at`) VALUES (1,'fresh-final-v6-milestones-1-23','2026-08-29 06:42:02');
/*!40000 ALTER TABLE `wdh_schema_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'webdominco_bldv6-db'
--

--
-- Dumping routines for database 'webdominco_bldv6-db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-26 18:00:56
