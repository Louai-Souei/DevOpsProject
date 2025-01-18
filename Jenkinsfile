pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        BRANCH_NAME = "${env.BRANCH_NAME ?: 'default-branch'}" // Set default value in case BRANCH_NAME is null
        BRANCH = "release-${BRANCH_NAME.replace('release-', '')}"
        IMAGE_NAME = "devops-project"
    }

    stages {
        stage('Build and Push Docker Image') {
            steps {
                script {
                    echo "BRANCH_NAME: ${env.BRANCH_NAME}"
                    echo "BRANCH: ${BRANCH}"
                    dir('client') {
                        sh """
                            docker build -t ${DOCKER_HUB_USERNAME}Front/${IMAGE_NAME}:${BRANCH} -f ./Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH}
                        """
                    }
                    dir('server') {
                        sh """
                            docker build -t ${DOCKER_HUB_USERNAME}Back/${IMAGE_NAME}:${BRANCH} -f ./Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH}
                        """
                    }

                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    sh """
                        docker pull ${DOCKER_HUB_USERNAME}Back/${IMAGE_NAME}:${BRANCH}
                        docker pull ${DOCKER_HUB_USERNAME}Front/${IMAGE_NAME}:${BRANCH}
                        docker-compose -f docker-compose.yml down
                        docker ps -q | xargs -r docker stop
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}