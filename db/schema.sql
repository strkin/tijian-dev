-- 发现页数据库结构
-- 由 `npm run db:init` 自动执行；也可以在 MySQL 客户端中手动运行。

CREATE TABLE IF NOT EXISTS `discover_posts` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '帖子 ID',
  `title`      VARCHAR(80)  NOT NULL                COMMENT '标题',
  `content`    TEXT         NOT NULL                COMMENT '正文（纯文本，换行分段）',
  `category`   VARCHAR(20)  NOT NULL DEFAULT '医疗科普' COMMENT '分类',
  `author`     VARCHAR(30)  NOT NULL DEFAULT '匿名用户' COMMENT '作者昵称',
  `cover`      VARCHAR(255) NOT NULL DEFAULT '/covers/cover-1.svg' COMMENT '封面图地址',
  `like_count` INT UNSIGNED NOT NULL DEFAULT 0      COMMENT '点赞数',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  PRIMARY KEY (`id`),
  KEY `idx_discover_category` (`category`),
  KEY `idx_discover_created` (`created_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '发现页帖子';

CREATE TABLE IF NOT EXISTS `discover_post_images` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id`    INT UNSIGNED NOT NULL COMMENT '所属帖子',
  `url`        VARCHAR(255) NOT NULL COMMENT '图片地址',
  `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_discover_images_post` (`post_id`),
  CONSTRAINT `fk_discover_images_post`
    FOREIGN KEY (`post_id`) REFERENCES `discover_posts` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '发现页帖子正文配图';

CREATE TABLE IF NOT EXISTS `discover_likes` (
  `post_id`   INT UNSIGNED NOT NULL,
  `client_id` VARCHAR(64)  NOT NULL COMMENT '浏览器本地生成的访客标识',
  `created_at` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`, `client_id`),
  CONSTRAINT `fk_discover_likes_post`
    FOREIGN KEY (`post_id`) REFERENCES `discover_posts` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = '发现页点赞记录（未登录，按客户端标识去重）';
