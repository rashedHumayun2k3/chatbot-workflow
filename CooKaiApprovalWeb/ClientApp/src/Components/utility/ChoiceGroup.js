import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

const options = [
    { key: 'A', text: 'Option A' },
    { key: 'B', text: 'Option B' },
    { key: 'C', text: 'Option C', disabled: true },
    { key: 'D', text: 'Option D' },
];

export const ChoiceGroupControlledExample = () => {
    const [selectedKey, setSelectedKey] = React.useState('B');

    const onChange = React.useCallback((ev, option) => {
        setSelectedKey(option.key);
    }, []);

    return <ChoiceGroup selectedKey={selectedKey} options={options} onChange={onChange} label="Pick one" />;
};