import { readFileSync } from 'fs';

const puzzleInput = readFileSync('./input.txt', 'utf-8');

const exampleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

interface file {
    name: string;
    size: number;
}
interface dir {
    name: string;
    items: Array<file | dir>;
    parent: dir | undefined;
    size: number;
}

// mutate the currentDir and input the lsOutput into its tree, returns a reference to dir?
function ls(currentDir: dir, lsOutput: Array<string>): dir {
    currentDir.items = lsOutput
        .filter(i => i !== '')
        .map(l => {
            const [pre, name] = l.split(' ');
            if (pre === 'dir') {
                return createDir(name, currentDir);
            }
            return createFile(name, pre);
        });
    recalculateSizeOfDir(currentDir);

    return currentDir;
}

function recalculateSizeOfDir(wd: dir) {
    // calculate the size of this dir (for now)
    // if we are not the top-most dir lets re-calculate those as well

    wd.size = wd.items.reduce((acc, curr) => acc+curr.size, 0);
    if (wd.parent !== undefined) {
        recalculateSizeOfDir(wd.parent);
    }
}

function createFile(name: string, size: string): file {
    return { name, size: parseInt(size, 10)} as file;
}

function createDir(name:string, parent: dir | undefined): dir {
    return {
        name: name, 
        items: new Array<file | dir>(),
        parent,
        size: 0,
    } as dir;
}

function cd(currentWorkingDir: dir, cdTo: string): dir {
    if (cdTo === '..') {
        if(currentWorkingDir.parent === undefined){
            // we are the topmost already
            return currentWorkingDir;
        }
        return currentWorkingDir.parent;
    }

    if (cdTo === '/') {
        //recurse to top level
        if (currentWorkingDir.parent === undefined) {
            return currentWorkingDir;
        }
        return cd(currentWorkingDir.parent, '/');
    }

    // subfolder
    const navTo = currentWorkingDir.items.find(d => d.name === cdTo);
    if (navTo === undefined || !instanceOfDir(navTo)) {
        throw new Error('subdir not found or no directory');
    }
    return navTo;
}

function instanceOfDir(object: any): object is dir {
    return 'items' in object;
}





describe('ls', () => {
    test('parsesLsOutput', () => {
        const wd = createDir('/', undefined); // root folder
        const input = `dir a
14848514 b.txt
8504156 c.dat
dir d`;
        const output = ls(wd, input.split('\n'));

        expect(output.items.length).toEqual(4);
        expect(output.items[0].name).toEqual('a');
        expect(output.items[1].name).toEqual('b.txt');
        expect(output.items[2].name).toEqual('c.dat');
        expect(output.items[3].name).toEqual('d');
    });
});

describe('cd', () => {
    test('cd a - navigates to subfolder', () => {
        const input = createDir('/', undefined);
        input.items.push(createDir('a', input));
        
        const wd = cd(input, 'a');
        expect(wd.name).toEqual('a');
    });

    test('cd .. - navigates to parent folder', () => {
        const root = createDir('/', undefined);
        const child = createDir('a', root);
        root.items.push(child);

        const wd = cd(child, '..');
        expect(wd.name).toEqual('/');
    });

    test('cd / - navigates to root folder', () => {
        const root = createDir('/', undefined);
        const child = createDir('a', root);
        const childchild = createDir('b', child);
        root.items.push(child);
        child.items.push(childchild);

        const wd = cd(childchild, '/');
        expect(wd.name).toEqual('/');
    });
});

function parseCommandOutput(puzzleInput: string): dir {
    const tree = puzzleInput
        .split('$ ')
        .filter(i => i !== '')
        .reduce((wd: dir, commandWithOutput, currentIndex) => {
            const lines = commandWithOutput.split('\n');
            const commandLine = lines.shift() || '';

            const [command, optionalCommandArg] = commandLine.split(' ');
            if (command === 'ls') return ls(wd, lines);
            if (command === 'cd') return cd(wd, optionalCommandArg)
            
            throw new Error(`unknown command: ${command} (currentInex=${currentIndex})`)
        }, createDir('/', undefined));
    
    return cd(tree, '/');//back to the root;
}

function prettyPrintFileSystem(item: dir | file, indent: number=0): string {
    if (instanceOfDir(item)) {
        return `${''.padStart(indent * 2, ' ')}- ${item.name} (dir)\n`
            + item.items.reduce((acc, curr) => acc + prettyPrintFileSystem(curr, 2 + indent), '');
        //item.items.forEach(itm => prettyPrintFileSystem(itm, indent + 2));
    }
    else {
        //console.log(`- ${item.name} (file, size=${item.size})`.padStart(indent * 2, ' '));
        return `${''.padStart(indent * 2, ' ')}- ${item.name} (file, size=${item.size})\n`.padStart(indent * 2, ' ');
    }
}


function findSubFoldersBiggerThan100000(wd: dir): Array<dir> {
    // find subfolders which might be big enough
    const bigSubFolders = wd.items
        .filter(item => instanceOfDir(item) === true)
        .map((item) => findSubFoldersBiggerThan100000(item as any as dir))
        .flat();

    if (wd.size < 100000) {
        return [wd].concat(bigSubFolders);
    }
    return bigSubFolders;
}

const fileSystem = parseCommandOutput(exampleInput)
process.stdout.write(prettyPrintFileSystem(fileSystem));
const bigFolders = findSubFoldersBiggerThan100000(fileSystem);
process.stdout.write(bigFolders.reduce((acc, curr) => acc+`- ${curr.name} size=${curr.size}\n`, ''));


const day7FileSystem = parseCommandOutput(puzzleInput);
const day7BigFolders = findSubFoldersBiggerThan100000(day7FileSystem);
console.log(`total size, day7-1= ${day7BigFolders.reduce((acc,curr) => acc+ curr.size, 0)}`);

// part 2
const totalfilesystemsize = 70000000;
const used = day7FileSystem.size;
const freeSpace = (totalfilesystemsize - used)
const spaceToFreeUp = 30000000 - freeSpace;

console.log(`day7-2, space to free up = ${spaceToFreeUp}`);

// order all directories in a flat list
function getAllDirectoriesRecursive(wd: dir) : Array<dir> {
    const subDirs = wd.items
        .filter(item => instanceOfDir(item))
        .map(item => getAllDirectoriesRecursive(item as dir))
        .flat();

    return [wd].concat(subDirs);
}

const dirs = getAllDirectoriesRecursive(day7FileSystem);
const smallest = dirs
    .filter(d => d.size > spaceToFreeUp)
    .sort((a, b) => a.size - b.size)
    [0];

console.log(`day7-2: size of smallest folder to delete = ${smallest.size}`);