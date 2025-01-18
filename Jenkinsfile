pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        RELEASE_VERSION = env.BRANCH_NAME.replace('release-', '')
        IMAGE_NAME = 'louai/crud-transfers-app'
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    sh """
                        cd server
                        docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${RELEASE_VERSION} -f ./Dockerfile .
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                        docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${RELEASE_VERSION}
                    """
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    sh """
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${RELEASE_VERSION}
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}