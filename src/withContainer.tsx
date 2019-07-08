import * as React from 'react';
import { ContainerComponentProps } from './ContainerComponentProps';

/**
 * Create a HOC that combines a container with a preenter/Ui component.
 * 
 * The Container should expect Coponent to be passed as a prop (you can use ContainerComponentProps to make this easy to keep typesafe).
 *
 * The Container can pass the Presenter any props it needs to for the Ui  (which again can be typesafe by passing a generic argument to ContainerComponentProps).
 * 
 * @param Container
 * @param props
 */
export function withContainer<ContainerProps extends ContainerComponentProps = any, PresenterProps = any>(Container: React.ComponentType<ContainerProps>, props?: Partial<ContainerProps>): ((component: React.ComponentType<PresenterProps>) => React.ComponentClass<ContainerProps>) {
    var wrapper = (Component: React.ComponentType<PresenterProps>): React.ComponentClass<ContainerProps> => {
        return class extends React.Component<ContainerProps> {
            static displayName = `withContainer(${getDisplayName(Container)})(${getDisplayName(Component)})`;

            render() {
                let { ...rest } = this.props;

                return (<Container {...rest} {...{ component: Component }} {...(props ? props : {})} />);
            }
        };
    };

    return wrapper;
}


/**
 * Returns the display name of React component.
 * @param Component
 */
function getDisplayName(Component: any): string {
    return (
        Component.displayName ||
        Component.name ||
        (typeof Component === 'string' && Component.length > 0
            ? Component
            : 'Unknown')
    );
}
