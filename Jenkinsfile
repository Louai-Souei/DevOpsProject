pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'
        DOCKER_HUB_PASSWORD = 'louai2811'
        IMAGE_NAME = 'crud-transfers-app'
    }

    stages {
        stage('Build and Push Docker Images') {
            steps {
                script {
                    def version = env.BRANCH_NAME?.replace('release-', '') ?: 'latest'
                    def backendImage = "${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-backend:${version}"
                    def frontendImage = "${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-frontend:${version}"

                    echo "Building and pushing images for version: ${version}"

                    // Build and Push Backend
                    dir('server') {
                        sh """
                            echo "Building backend image: ${backendImage}"
                            docker build -t ${backendImage} -f Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${backendImage}
                        """
                    }

                    // Build and Push Frontend (if applicable)
                    dir('client') {
                        sh """
                            echo "Building frontend image: ${frontendImage}"
                            docker build -t ${frontendImage} -f Dockerfile .
                            echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                            docker push ${frontendImage}
                        """
                    }
                }
            }
        }

        stage('Deploy Application') {
            steps {
                script {
                    def version = env.BRANCH_NAME?.replace('release-', '') ?: 'latest'
                    def backendImage = "${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-backend:${version}"
                    def frontendImage = "${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-frontend:${version}"

                    echo "Deploying application using Docker images: Backend -> ${backendImage}, Frontend -> ${frontendImage}"

                    sh """
                        # Pull the latest images
                        docker pull ${backendImage}
                        docker pull ${frontendImage}


                        # Stop and remove any existing containers
                        docker-compose -f docker-compose.yml down
                        # Start new containers
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }
    }
}