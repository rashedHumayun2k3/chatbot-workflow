CREATE TABLE [dbo].[TemplateLevels] (
    [Id]               UNIQUEIDENTIFIER NOT NULL,
    [LevelName]        NVARCHAR (250)   NULL,
    [LevelNo]          INT              NOT NULL,
    [IsSingleApprover] BIT              NOT NULL,
    [TemplateId]       UNIQUEIDENTIFIER NOT NULL,
    [Created]          DATETIME         NOT NULL,
    [IsApproveOnly]    BIT              NOT NULL,
    CONSTRAINT [PK_TemplateLevels] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TemplateLevels_Templates] FOREIGN KEY ([TemplateId]) REFERENCES [dbo].[Templates] ([Id])
);

