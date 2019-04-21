import React from 'react';
import { Button, Icon, Link } from 'semantic-ui-react/dist/commonjs';
import config from '../config';

const providers = [
    {
        'id': 'facebook',
        'link': `//www.facebook.com/sharer/sharer.php?u=${config.publicUrl}`,
        'text': 'Facebook'
    },
    {
        'id': 'vk',
        'link': `//vk.com/share.php?url=${config.publicUrl}`,
        'text': 'VK'
    },
    {
        'id': 'twitter',
        'link': `//twitter.com/home?status=${config.publicUrl} Record screen video`,
        'text': 'Twitter'
    },
    {
        'id': 'linkedin',
        'link': `//www.linkedin.com/shareArticle?mini=true&url=${config.publicUrl}&title=&summary=Record screen video&source=`,
        'text': 'LinkedIn'
    },
    {
        'id': 'pinterest',
        'link': `//pinterest.com/pin/create/button/?url=${config.publicUrl}&media=&description=Record screen video`,
        'text': 'Pinterest'
    }
]

const Social = props => (
    <div>
        {providers.map(p =>
            <a href={p.link}>
                <Button icon color={p.id}>
                    <Icon name={p.id}></Icon>
                </Button>
            </a>)}
    </div>
);

export default Social;
