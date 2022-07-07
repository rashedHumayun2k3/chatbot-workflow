CREATE TABLE [dbo].[TemplateApproverOrViewer] (
    [Id]              UNIQUEIDENTIFIER NOT NULL,
    [TemplateLevelId] UNIQUEIDENTIFIER NOT NULL,
    [UserId]          UNIQUEIDENTIFIER NOT NULL,
    [IsApprover]      BIT              NOT NULL,
    [GroupInfo]       NVARCHAR (1000)  NULL,
    [Created]         DATETIME         NOT NULL,
    CONSTRAINT [PK_TemplateApproverOrViewer] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_TemplateApproverOrViewer_TemplateLevels] FOREIGN KEY ([TemplateLevelId]) REFERENCES [dbo].[TemplateLevels] ([Id]),
    CONSTRAINT [FK_TemplateApproverOrViewer_UserInfo] FOREIGN KEY ([UserId]) REFERENCES [dbo].[UserInfo] ([Id])
);

