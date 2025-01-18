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
                            echo "Building and pushing front image: ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}"
                            docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH} -f ./Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                        """
                    }
                    dir('server') {
                        sh """
                            echo "Building and pushing back image: ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}"
                            docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH} -f ./Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}
                        """
                    }
                }
            }
        }

        stage('Pull Docker Images') {
            steps {
                script {
                    sh """
                        echo "Pulling back image: ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}"
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}

                        echo "Pulling front image: ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}"
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                    """
                }
            }
        }

        stage('Run Containers from Pulled Images') {
            steps {
                script {
                    sh """
                        echo "Stopping and removing existing containers"
                        docker ps -q | xargs -r docker stop
                        docker ps -aq | xargs -r docker rm

                        echo "Running application using pulled images"
                        docker network create pipeline_network || true

                        docker run -d --name back --network pipeline_network -p 5000:5000 ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}
                        docker run -d --name front --network pipeline_network -p 4000:3050 ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                    """
                }
            }
        }

        stage('Restart with Docker Compose') {
            steps {
                script {
                    sh """
                        echo "Restarting application with docker-compose"
                        docker-compose -f docker-compose.yml down
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}