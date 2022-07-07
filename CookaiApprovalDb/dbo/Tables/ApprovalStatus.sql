CREATE TABLE [dbo].[ApprovalStatus] (
    [Id]      INT           NOT NULL,
    [Name]    NVARCHAR (50) NOT NULL,
    [Created] DATETIME      NOT NULL,
    CONSTRAINT [PK_ApprovalStatus] PRIMARY KEY CLUSTERED ([Id] ASC)
);

