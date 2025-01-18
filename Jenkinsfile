pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        BRANCH_NAME = "${env.BRANCH_NAME ?: 'default'}"
        BRANCH = "release-${BRANCH_NAME.replace('release-', '')}"
        IMAGE_NAME = "devops-project"
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    echo "Building Docker images with BRANCH: ${BRANCH}"
                    dir('client') {
                        sh """
                            docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH} -f ./Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                        """
                    }
                    dir('server') {
                        sh """
                            docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH} -f ./Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}
                        """
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    echo "Deploying Docker images for BRANCH: ${BRANCH}"
                    sh """
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                        docker-compose -f docker-compose.yml down
                        docker ps -q | xargs -r docker stop
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}
