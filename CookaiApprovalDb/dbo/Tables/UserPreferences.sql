CREATE TABLE [dbo].[UserPreferences] (
    [Id]                  UNIQUEIDENTIFIER NOT NULL,
    [UserId]              UNIQUEIDENTIFIER NULL,
    [SeletedFilterStatus] INT              NULL,
    [Created]             DATETIME         NOT NULL,
    CONSTRAINT [PK_UserPreferences] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserPreferences_UserInfo] FOREIGN KEY ([UserId]) REFERENCES [dbo].[UserInfo] ([Id])
);

