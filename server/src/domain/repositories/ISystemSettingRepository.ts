export interface ISystemSetting {
    id: string;
    key: string;
    value: string;
    updatedAt: Date;
}

export interface ISystemSettingRepository {
    findByKey(key: string): Promise<ISystemSetting | null>;
    update(key: string, value: string): Promise<ISystemSetting>;
    upsert(key: string, value: string): Promise<ISystemSetting>;
    findAll(): Promise<ISystemSetting[]>;
}
