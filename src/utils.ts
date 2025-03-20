import { exec } from 'node:child_process';
import * as path from 'node:path';
import { promisify } from 'node:util';
import { z } from 'zod';

const execAsync = promisify(exec);

const ALLOWED_BASE_DIRS = [path.resolve('/var/log/')];

export const dirnameSchema = z.string().refine(
  (input) => {
    const resolved = path.resolve(input);
    return ALLOWED_BASE_DIRS.some(
      (allowedDir) =>
        resolved === allowedDir || resolved.startsWith(allowedDir + path.sep),
    );
  },
  {
    message: `The directory must be one of ${ALLOWED_BASE_DIRS.join(', ')} or a subdirectory thereof.`,
  },
);

export const execCommand = async (dirname: string, command: string) => {
  const validDirname = dirnameSchema.parse(dirname);
  return await execAsync(command, { cwd: validDirname });
};
