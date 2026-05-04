export const load = async (url, context, nextLoad) => {
  if (url.endsWith('.svg')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `
        import React from 'react';
        const SvgStub = (props) => React.createElement('svg', props);
        export default SvgStub;
        export const ReactComponent = SvgStub;
      `,
    };
  }
  return nextLoad(url, context);
};
