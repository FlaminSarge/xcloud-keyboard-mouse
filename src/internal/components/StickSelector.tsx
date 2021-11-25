import React, { useCallback } from 'react';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';
import classnames from 'classnames';
import { StickNum } from '../../shared/types';

const size = { width: 20, height: 20 };

const options: IChoiceGroupOption[] = [
  {
    key: '-1',
    imageSrc: '/images/empty-set.svg',
    selectedImageSrc: '/images/empty-set.svg',
    imageAlt: 'None',
    imageSize: size,
    text: 'None',
  },
  {
    key: '0',
    imageSrc: '/images/circle.svg',
    selectedImageSrc: '/images/circle.svg',
    imageAlt: 'Left Stick',
    imageSize: size,
    text: 'Left',
  },
  {
    key: '1',
    imageSrc: '/images/circle.svg',
    selectedImageSrc: '/images/circle.svg',
    imageAlt: 'Right Stick',
    imageSize: size,
    text: 'Right',
  },
];

interface StickSelectorProps {
  disabled?: boolean;
  readOnly?: boolean;
  onChange: (newVal?: StickNum) => void;
  stick: StickNum | undefined;
}

export default function StickSelector({ disabled, stick, onChange, readOnly }: StickSelectorProps) {
  const handleChange = useCallback(
    (ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option?: IChoiceGroupOption) => {
      const key = option && option.key;
      const num: StickNum | undefined = key === '0' ? 0 : key === '1' ? 1 : undefined;
      onChange(num);
    },
    [onChange],
  );
  return (
    <ChoiceGroup
      className={classnames(readOnly && 'no-pointer-events')}
      disabled={disabled}
      label="Mouse movement controls which analog stick?"
      selectedKey={stick === 0 ? '0' : stick === 1 ? '1' : '-1'}
      onChange={readOnly ? undefined : handleChange}
      options={options}
    />
  );
}
