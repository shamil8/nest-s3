# NestJS Starter Kit

The repository provides examples of the main toolkit used to write a basic service on the NestJS framework.

## Install submodule S3
1. pull
```shell
git submodule add https://github.com/shamil8/nest-s3.git libs/s3
```
2. Fix submodule file: `.gitmodules`
```
[submodule "packages/api-service/libs/s3"]
	branch = main
	path = packages/api-service/libs/s3
	url = https://github.com/shamil8/nest-s3.git
```

### Required

1. aws-sdk
2. @types/multer
3. submodule `libs/crypto-utils`

### Add lib:
```yarn
yarn add aws-sdk

yarn add -D @types/multer

git submodule add https://github.com/shamil8/crypto-utils.git libs/crypto-utils
```

### Remove this lib:
```yarn
yarn remove aws-sdk @types/multer
```

### Remove submodule from git:
1. remove submodule folder
2. remove: `rm -rf .git/modules/libs/crypto-utils/`
3. remove: `rm -rf .git/modules/libs/s3/`

### Env example
```dotenv
# AWS S3 module environments
AWS_ACCESS_KEY_ID=Pyft**********
AWS_SECRET_ACCESS_KEY=s3x5SaV**********
```
