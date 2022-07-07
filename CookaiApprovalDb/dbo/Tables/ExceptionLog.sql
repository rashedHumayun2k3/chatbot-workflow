CREATE TABLE [dbo].[Exceptionlog] (
    [id]         BIGINT         IDENTITY (1, 1) NOT NULL,
    [timestamp]  DATETIME       NOT NULL,
    [level]      VARCHAR (100)  NOT NULL,
    [logger]     VARCHAR (1000) NOT NULL,
    [message]    VARCHAR (3600) NOT NULL,
    [userid]     INT            NULL,
    [exception]  VARCHAR (3600) NULL,
    [stacktrace] VARCHAR (3600) NULL,
    CONSTRAINT [PK_ExceptionLog] PRIMARY KEY CLUSTERED ([id] ASC)
);

