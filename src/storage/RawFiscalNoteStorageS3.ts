import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import RawFiscalNoteStorage from "../domain/interfaces/RawFiscalNoteStorage";

// TODO: add this to a config file
const BUCKET_NAME = 'nfce-app'
const REGION = 'us-east-1'

const BASE_DIR = 'nfce'

export default class RawFiscalNoteStorageS3 implements RawFiscalNoteStorage {
    private client = new S3Client({ region: REGION });
    
    async save(fileName: string, file: Buffer): Promise<void> {
        const params = {
            Bucket: BUCKET_NAME,
            Key: `${BASE_DIR}/${fileName}`,
            Body: file,
        };
        console.log(params)
        const command = new PutObjectCommand(params);
        await this.client.send(command);
    }
}