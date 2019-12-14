import { FormInstance } from 'rc-field-form/lib';

// export type IonValidateFormResul<T> = Promise<T | Error | void>;

// export declare function IOnValidateForm<T>(): Promise<T | Error | void>;

declare type IOnValidateFormResultWithoutPromise<T> = T | void;

export declare type IOnValidateFormResult<T> = Promise<IOnValidateFormResultWithoutPromise<T>>;
export declare type ISubmitData<T> = IOnValidateFormResultWithoutPromise<T>;

export declare interface ICommenFormRef<T> {
  onValidateForm: () => IOnValidateFormResult<T>;
  form: FormInstance;
}
