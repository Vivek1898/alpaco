/* eslint-disable */
// @ts-nocheck
'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef((props:any, ref:any) => {
    const { className, value = 0, indicatorClassName, ...otherProps } = props;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const normalizedValue = Math.min(Math.max(0, value), 100);

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
            {...otherProps}
        >
            <ProgressPrimitive.Indicator
                className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
                style={{
                    transform: `translateX(-${100 - normalizedValue}%)`
                }}
            />
        </ProgressPrimitive.Root>
    );
});

Progress.displayName = "Progress";

export { Progress };