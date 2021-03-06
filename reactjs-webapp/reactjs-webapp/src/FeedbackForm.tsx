import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import * as React from "react";
import {IFieldProps } from './Field'

export interface IFeedbackFormContext extends IFeedbackFormState {
    /* Function that allows values in the values state to be set */
    setValues: (values: IValues) => void;
    /* Function that validates a field */
    validate: (fieldName: string) => void;
}
/* 
 * The context which allows state and functions to be shared with Field.
 * Note that we need to pass createContext a default value which is why undefined is unioned in the type
 */
export const FeedbackFormContext = React.createContext<IFeedbackFormContext | undefined>(
    undefined
);

/**
 * Validates whether a field has a value
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const required = (values: IValues, fieldName: string): string =>
    values[fieldName] === undefined ||
        values[fieldName] === null ||
        values[fieldName] === ""
        ? "This must be populated"
        : "";

/**
 * Validates whether a field is a valid email
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isEmail = (values: IValues, fieldName: string): string => {
    if (values[fieldName] === undefined ||
        values[fieldName] === null ||
        values[fieldName] === "") {
        return "This must be populated"
    }
    else if (values[fieldName] &&
        values[fieldName].search(
            /^[a-zA-Z0-9.!#$%&?*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )) 
    {
        return "This must be in a valid email format"
    }
    else {
       return ""
    }
}
/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @param {number} length - The maximum number of characters
 * @returns {string} - The error message
 */
export const maxLength = (
    values: IValues,
    fieldName: string,
    length: number
): string =>
    values[fieldName] && values[fieldName].length > length
        ? `This can not exceed ${length} characters`
        : "";

export interface IFields {
    [key: string]: IFieldProps;
}

interface IFeedbackFormProps {
    /* The http path that the form will be posted to */
    action: string;
    /* The props for all the fields on the form */
    fields: IFields;
    /* A prop which allows content to be injected */
    render: () => React.ReactNode 
}

export interface IValues {
    /* Key value pairs for all the field values with key being the field name */
    [key: string]: any;
}

export interface IErrors {
    /* The validation error messages for each field (key is the field name */
    [key: string]: string;
}

export interface IFeedbackFormState {
    /* The field values */
    values: IValues;

    /* The field validation error messages */
    errors: IErrors;

    /* Whether the form has been successfully submitted */
    submitSuccess?: boolean;
}

export class FeedbackForm extends React.Component<IFeedbackFormProps, IFeedbackFormState>{
    constructor(props: IFeedbackFormProps) {
        super(props);

        const errors: IErrors = {};
        const values: IValues = {};
        this.state = {
            errors,
            values
        };
    }

    public render() {
        const { submitSuccess, errors } = this.state;
        const context: IFeedbackFormContext = {
            ...this.state,
            setValues: this.setValues,
            validate:this.validate
        };
        return (
            <FeedbackFormContext.Provider value={context}>
            <form onSubmit={this.handleSubmit} noValidate={true}>
                <div className="contactusform">
                    {this.props.render()}
                        <div className="form-group">
                            <DefaultButton
                                type="submit"
                                className="btn btn-primary"
                                disabled={this.haveErrors(errors)}
                            >Submit
                            </DefaultButton>
                    </div>
                    {submitSuccess && (
                        <div className="alert alert-info" role="alert">
                            The form was successfully submitted!
            </div>
                    )}
                    {submitSuccess === false &&
                        !this.haveErrors(errors) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, an unexpected error has occurred
              </div>
                        )}
                    {submitSuccess === false &&
                        this.haveErrors(errors) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, the form is invalid. Please review, adjust and try again
              </div>
                        )}
                </div>
                </form>
             </FeedbackFormContext.Provider>
        );
    }

    /**
     * Executes the validation rule for the field and updates the form errors
     * @param {string} fieldName - The field to validate
     * @returns {string} - The error message
     */
    private validate = (fieldName: string): string => {
        let newError: string = "";

        if (
            this.props.fields[fieldName] &&
            this.props.fields[fieldName].validation
        ) {
            newError = this.props.fields[fieldName].validation!.rule(
                this.state.values,
                fieldName,
                this.props.fields[fieldName].validation!.args
            );
        }
        this.state.errors[fieldName] = newError;
        this.setState({
            errors: { ...this.state.errors, [fieldName]: newError }
        });
        return newError;
    };

    /**
     * Stores new field values in state
     * @param {IValues} values - The new field values
     */
    private setValues = (values: IValues) => {
        this.setState({ values: { ...this.state.values, ...values } });
    };

    /**
     * Returns whether there are any errors in the errors object that is passed in
     * @param {IErrors} errors - The field errors
     */
    private haveErrors(errors: IErrors) {
        let haveError: boolean = false;
        Object.keys(errors).map((key: string) => {
            if (errors[key].length > 0) {
                haveError = true;
            }
        });
        return haveError;
    };

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    private handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();
        console.log(this.state.values);

        if (this.validateForm()) {
            const submitSuccess: boolean = await this.submitForm();
            this.setState({ submitSuccess });
        }
    };

    /**
     * Executes the validation rules for all the fields on the form and sets the error state
     * @returns {boolean} - Whether the form is valid or not
     */
    private validateForm(): boolean {
        const errors: IErrors = {};
        Object.keys(this.props.fields).map((fieldName: string) => {
            errors[fieldName] = this.validate(fieldName);
        });
        this.setState({ errors });
        return !this.haveErrors(errors);
    }

    /**
     * Submits the form to the http api
     * @returns {boolean} - Whether the form submission was successful or not
     */
    private async submitForm(): Promise<boolean> {
        try {
            const response = await fetch(this.props.action, {
                body: JSON.stringify(this.state.values),
                headers: new Headers({
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }),
                method: "post"
            });
            if (response.status === 400) {
                /* Map any validation errors to IErrors */
                let responseBody: any;
                responseBody = await response.json();
                const errors: IErrors = {};
                Object.keys(responseBody).map((key: string) => {
                    // For ASP.NET core, the field names are in title case - so convert to camel case
                    const fieldName = key.charAt(0).toLowerCase() + key.substring(1);
                    errors[fieldName] = responseBody[key];
                });
                this.setState({ errors });
            }
            return response.ok;
        } catch (ex) {
            console.log(ex);
            return false;
        }
    }




}

