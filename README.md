# react-withcontainer
HOC that allows ioc for Uis to wrap themselves in containers passing themselves to the container as props.container.

## Installation

Install with npm:

```shell
npm install react-withcontainer
```

Or with yarn:

```shell
yarn add react-withcontainer
```

## Usage

### Container

Your container should contain all the normal logic for containers under the container-presenter pattern, and should expect to receive an additional field
component represeting the Prenter Component in its props as props.component.

```ts
// ExampleContainer.tsx
import * as React from "react";
import { ContainerComponentProps } from "react-withcontainer";

/**
 * This is the props for the container.
 */
export interface ExampleContainerProps extends ContainerComponentProps {
    // Additional props for the container.
}

interface Model {
    id: string,
    name: string
}

/**
 * These are the props the container will pass on to its Presenter/Ui.
 */
export interface ExampleContainerUiProps {
    model: Model | undefined,

    changeModel: (changes: Partial<Model>) => void,
    load: () => Promise<boolean>
    save: () => Promise<boolean>
}


export const ExampleContainer = (props: ExampleContainerProps) => {
    const { component, id, ...rest } = props;
	
    const [model, setModel] = React.useState<Model | undefined>(undefined);

	// Change the fields in the model in a controlled way using setModel.
    const changeModel = React.useCallback((changes: Partial<UserProfile>) => {
        setModel(prevState => ({
            ...(prevState as UserProfile),
            ...changes
        }));
    }, [setModel]);

    // Example method to load a model from storage.
    const load = React.useCallback(async (): Promise<boolean> => {
        let result = await loadModel(id); // Replace loadModel() with your custom loading logic.
        setModel(result);
        return true;
    }, [setModel, id]);

    // Example method to save a model to storage.
    const save = React.useCallback(async (): Promise<boolean> => {
        if (!model) {
            return false;
        }

        let ok = await saveModel(model.id, model, isCreate); // Replace saveModel() with your actual code to save the model to stroage.
        return ok;
    }, [model, isCreate]);

    // Load on mount if we haven't got a model.
    React.useEffect(() => {
        if (!model && !isLoading && !loadingErrors) {
            load();
        }
    }, [model, isLoading, loadingErrors, load]);

    let Component = component;

    return (
        <Component {...rest} model={model} laod={load} save={save} />
    );
};
```

### Presenter

Your presenter accepts all the props passed by the component and should focus only on providing a Ui.  It can then use the withContainer() HOC to wrap itself in
an appropriate compatable container.

```ts
// ExampleUi.tsx
import * as React from "react";
import { withContainer } from "react-withcontainer";
import { Form, FormGroup, Label, Button, Container, Input } from 'reactstrap';
import { ExampleContainer, ExampleContainerUiProps } from 'ExampleContainer'; // This contains the example component from above.

export const ExampleUi = (props: ExampleContainerUiProps) => {
    const onSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await props.save();
    }, [props.save]);

	const onChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        var target = event.currentTarget;
        props.changeModel({
            [target.name]: (target.type == 'checkbox' ? target.checked : target.value)
        });
    }, [props.changeModel]);

    return (
        <Container>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" name="name" placeholder="Name" value={props.model.name} onChange={onChange}  />
                </FormGroup>

                <div>
                    <Button type="submit" color="primary">
                        Save
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export const Example = withContainer(ExampleContainer)(ExampleUi);

```

## Typescript

This project is written in typescript and comes with its own bindings.

## License

Licensed under the MIT license.