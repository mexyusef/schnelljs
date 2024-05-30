import { ModelInformation } from "./ModelInformation.js";
import { Model, ModelSettings } from "./Model.js";
export declare abstract class AbstractModel<SETTINGS extends ModelSettings> implements Model<SETTINGS> {
    readonly settings: SETTINGS;
    constructor({ settings }: {
        settings: SETTINGS;
    });
    abstract readonly provider: string;
    abstract readonly modelName: string | null;
    get modelInformation(): ModelInformation;
    abstract get settingsForEvent(): Partial<SETTINGS>;
    abstract withSettings(additionalSettings: Partial<SETTINGS>): this;
}
