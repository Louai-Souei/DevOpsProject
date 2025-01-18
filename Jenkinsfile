pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        BRANCH = "release-${env.BRANCH_NAME.replace('release-', '')}"
        IMAGE_NAME = "devops-project"

    }

    stages {

        stage('Build and Push Docker Image') {
            steps {
                script {
                    sh """
                        cd server
                        docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH} -f ./Dockerfile .
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                        docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH}
                    """
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    sh """
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH}
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}
