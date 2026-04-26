import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import config from '../config';

const providers = [
    {
        'id': 'facebook',
        'link': `//www.facebook.com/sharer/sharer.php?u=${config.publicUrl}`,
        'text': 'Facebook',
        'color': 'facebook'
    },
    {
        'id': 'vk',
        'link': `//vk.com/share.php?url=${config.publicUrl}`,
        'text': 'VK',
        'color': 'vk'
    },
    {
        'id': 'twitter',
        'link': `//twitter.com/home?status=${config.publicUrl} Record screen video`,
        'text': 'Twitter',
        'color': 'twitter'
    },
    {
        'id': 'linkedin',
        'link': `//www.linkedin.com/shareArticle?mini=true&url=${config.publicUrl}&title=&summary=Record screen video&source=`,
        'text': 'LinkedIn',
        'color': 'linkedin'
    },
    {
        'id': 'pinterest',
        'link': `//pinterest.com/pin/create/button/?url=${config.publicUrl}&media=&description=Record screen video`,
        'text': 'Pinterest',
        'color': 'red'
    }
]

const Social = () => (
    <div>
        {providers.map(p =>
            <a href={p.link} key={p.id} target="_blank" rel="noopener noreferrer">
                <Button icon color={p.color}>
                    <Icon name={p.id} />
                </Button>
            </a>)}
    </div>
);

export default Social;

