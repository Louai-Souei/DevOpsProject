pipeline {
    agent any

    stages {
        stage('Build') {
            when {
                changeRequest()
            }
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Unit Test') {
            when {
                changeRequest()
            }
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube analysis (Optional)') {
            when {
                changeRequest()
            }
            steps {
                dir('server') {
                    script {
                        def scannerHome = tool name: 'sonar'
                        withSonarQubeEnv('sonarQube') {
                            sh '/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar/bin/sonar-scanner -Dsonar.projectKey=devops_project'
                        }
                    }
                }
            }
        }

        stage('Integration Test') {
            when {
                changeRequest()
            }
            steps {
                dir('server') {
                    sh 'npm run integration-test'
                }
            }
        }
    }
}

pipeline {
    agent any

    stages {
        stage('Build') {
            when {
                branch 'dev'
            }
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Unit Test') {
            when {
                branch 'develop'
            }
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube analysis (Optional)') {
            when {
                branch 'develop'
            }
            steps {
                dir('server') {
                    script {
                        def scannerHome = tool name: 'sonar'
                        withSonarQubeEnv('sonarQube') {
                            sh '/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar/bin/sonar-scanner -Dsonar.projectKey=devops_project'
                        }
                    }
                }
            }
        }

        stage('Integration Test') {
            when {
                branch 'develop'
            }
            steps {
                dir('server') {
                    sh 'npm run integration-test'
                }
            }
        }
    }
}

pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        IMAGE_NAME = 'image-louai'
        BRANCH_NAME = "release"
    }

    stages {
        stage('Build and Push Docker Image') {
            when {
                branch pattern: "release-.*", comparator: "REGEXP"
            }
            steps {
                script {
                    sh """
                        cd server
                        docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME} -f ./Dockerfile .
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                        docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME}
                    """
                }
            }
        }

        stage('Deploy Application') {
            when {
                branch pattern: "release-.*", comparator: "REGEXP"
            }
            steps {
                script {
                    sh """
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME}
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}