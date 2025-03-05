'use client'

import { RepositoryCollaborator } from "@/lib/types/repositoryTypes"
import { User } from "@/lib/types/userTypes"


interface CollaboratorsListProps {
    collaborators: RepositoryCollaborator[]
    users: User[]
}

export function CollaboratorsList({ collaborators, users }: CollaboratorsListProps) {
    return (
        <>
            {collaborators.length === 0 && (
                <div className="flex flex-col gap-4">
                    <p className="text-muted-foreground">No collaborators yet</p>
                </div>
            )}
            {collaborators.length > 0 && (
                <div className="flex flex-col gap-4">
                    {collaborators.map((collaborator) => (
                        <div key={collaborator.user_id}>{getUserDisplayName(users.find(user => user.id === collaborator.user_id)!)}</div>
                    ))}
                </div>
            )}
        </>
    )
}

function getUserDisplayName(user: User) {
    return user.full_name || user.email || user.id
}