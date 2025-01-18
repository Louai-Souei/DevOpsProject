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
        stage('Pull Docker Images') {
            steps {
                script {
                    echo "Pulling Docker images for branch: ${BRANCH}"

                    sh """
                        echo "${DOCKER_HUB_PASSWORD}" | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                    """
                }
            }
        }

        stage('Run Application with Pulled Images') {
            steps {
                script {
                    sh """
                        echo "Stopping and removing existing containers"
                        docker-compose -f docker-compose.yml down

                        echo "Running application using pulled images"
                        docker run -d --name api --network pipeline3_default ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-back:${BRANCH}
                        docker run -d --name client --network pipeline3_default ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}-front:${BRANCH}
                    """
                }
            }
        }
    }
}