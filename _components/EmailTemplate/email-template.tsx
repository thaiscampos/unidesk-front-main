import * as React from 'react';

interface EmailTemplateProps{
    Name: string
}

export function EmailTemplate({Name}: EmailTemplateProps){

    return(
        <div>
            <h1>Olá, Mundo!</h1>
        </div>
    )
}