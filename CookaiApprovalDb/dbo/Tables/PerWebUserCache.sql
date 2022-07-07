CREATE TABLE [dbo].[PerWebUserCache] (
    [EntryId]         BIGINT          IDENTITY (1, 1) NOT NULL,
    [WebUserUniqueId] NVARCHAR (500)  NOT NULL,
    [CacheBits]       VARBINARY (MAX) NOT NULL,
    [LastWrite]       DATETIME        NOT NULL,
    CONSTRAINT [PK_PerWebUserCache] PRIMARY KEY CLUSTERED ([EntryId] ASC)
);

