'use client';

import cn from 'classnames';
import React, { forwardRef, useRef, ButtonHTMLAttributes } from 'react';
import { mergeRefs } from 'react-merge-refs';

import LoadingDots from '@/components/ui/LoadingDots';

import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  loading?: boolean;
  width?: number | string;
  height?: number | string;
  variant?: 'slim' | 'flat' | 'gray' | 'primary' | 'delete' | 'deactivate';
  shape?: 'soft' | 'surface' | 'outline' | 'ghost';
  fontSize?: number;
  Component?: React.ComponentType;
}

const Button = forwardRef<HTMLButtonElement, Props>((props, buttonRef) => {
  const {
    className,
    variant = 'flat',
    children,
    active,
    loading = false,
    disabled = false,
    width,
    height,
    shape,
    fontSize,
    style = {},
    Component = 'button',
    ...rest
  } = props;
  const ref = useRef(null);
  const rootClassName = cn(
    styles.root,
    {
      [styles.slim]: variant === 'slim',
      [styles.delete]: variant === 'delete',
      [styles.deactivate]: variant === 'deactivate',
      [styles.loading]: loading,
      [styles.disabled]: disabled,
      [styles.soft]: shape === 'soft',
    },
    className
  );
  return (
    <Component
      aria-pressed={active}
      data-variant={variant}
      data-shape={shape}
      ref={mergeRefs([ref, buttonRef])}
      className={rootClassName}
      disabled={disabled}
      style={{
        width: width ? width : 'auto',
        height: height ? `${height}px` : 'auto',
        fontSize: fontSize || 'inherit',
      }}
      {...rest}
    >
      {children}
      {loading && (
        <i className="flex pl-2 m-0">
          <LoadingDots />
        </i>
      )}
    </Component>
  );
});

export default Button;
