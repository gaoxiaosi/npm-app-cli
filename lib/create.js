const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const execa = require('execa');
const spinner = require('ora')();

async function create(name) {
  const cwd = process.cwd();
  const targetDir = path.join(cwd, name);
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(targetDir)} already exists! Pick an action:`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Merge', value: 'merge' },
        ],
      },
    ])

    if (action === 'overwrite') {
      console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }

  await fs.mkdir(name);
  await fs.copy(path.resolve(__dirname, '../template'), targetDir);
  console.log(chalk.green('模板拷贝完成！'));
  await fs.writeFile(path.join(targetDir, 'README.md'), `# ${name}`);
  let packageInfo = await fs.readJSON(path.join(targetDir, 'package.json'));
  packageInfo.name = name;
  await fs.writeJSON(path.join(targetDir, 'package.json'), packageInfo);
  spinner.start(chalk.green('开始安装依赖'));
  execa.command('npm install', { cwd: targetDir });
  spinner.succeed(chalk.green(`安装依赖完成!请执行${chalk.cyan('cd ' + name)}到项目目录下进行开发`));
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    throw err
  })
}

