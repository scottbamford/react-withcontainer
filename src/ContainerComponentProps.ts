import * as React from 'react';

/**
 * Props that create a convention for passing presenter components into a container component to decouple the component from a specific presenter/Ui.
 * 
 * These components are usually consumed via the withContainer() HOC.
 */
export interface ContainerComponentProps<UiProps = any> {
    component: React.ComponentType<UiProps>
}
