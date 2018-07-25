import React from 'react';

const rel = 'noopener noreferrer';
const target = '_blank';

export interface ExternalLinkProps {
    url: string
    newTab: boolean
}

export interface DOM_a_Props {
    href: string
    rel?: string
    target: string
}

class ExternalLink extends React.PureComponent<ExternalLinkProps> {
    static defaultProps: ExternalLinkProps = {
        url: 'birdofchess.com',
        newTab: false,
    };

    getProps = () => {
        const { url, newTab } = this.props;
        const props: DOM_a_Props = {
            href: url,
            target,
        };
        if (newTab) {
            props.rel = rel;
        }
        return props;
    };

    render() {
        return (
            <a {...this.getProps()}>

            </a>
        );
    }
}
