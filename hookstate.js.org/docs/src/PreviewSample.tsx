import React from 'react'

import { ExamplesRepo, ExampleCodeUrl } from './examples/Index.tsx';

import ExampleIds from './examples/ids';

import { Preview } from '@storybook/addon-docs/blocks';

import { useStateLink } from '@hookstate/core';

const packageJson = require('../package.json');
const packageDependencies = packageJson.dependencies

export const VersionInfo = () => {
    const packs = Object.keys(packageDependencies)
        .filter(i => i.startsWith('@hookstate/'));
    const labels = packs.map((p, i) => <code key={p}>
        {p}: {packageDependencies[p]}<br />
    </code>)
    return <div style={{ paddingLeft: 20 }}>{labels}</div>;
}

const PreviewWithAsyncSource = (props: React.PropsWithChildren<{ url: string }>) => {
    const code = useStateLink(() => fetch(props.url).then(r => r.text()))

    let codeString = ''
    if (code.promised) {
        codeString = `Loading code sample from: ${props.url}`;
    } else if (code.error) {
        codeString = `Failure to load code sample from: ${props.url} (${code.error.toString()})`;
    } else {
        codeString = code.value.toString()
    }

    return <Preview mdxSource={codeString} isExpanded={true} >{props.children}</Preview>
};

export const PreviewSample = (props: { example?: string }) => {
    const exampleId = props.example && ExamplesRepo.has(props.example)
        ? props.example : ExampleIds.GlobalPrimitive;
    const exampleMeta = ExamplesRepo.get(exampleId)!;

    return <>
        <PreviewWithAsyncSource url={ExampleCodeUrl(exampleId)}>
            {exampleMeta.demo}
        </PreviewWithAsyncSource>
    </>
}
