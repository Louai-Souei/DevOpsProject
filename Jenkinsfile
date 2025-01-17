pipeline {
    agent any

    environment {
        DOCKER_HUB_USERNAME = 'louaisouei'  // Votre nom d'utilisateur DockerHub
        IMAGE_NAME = "image-louai"  // Nom de votre image Docker
        BRANCH_NAME = "release"  // Utilise le nom de la branche pour tagger l'image
    }

    stages {
        stage('Build') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube analysis') {
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

        // Stage 1: Build and Push Docker Image
        stage('Build and Push Docker Image') {
            steps {
                script {
                    // Build Docker image with the tag as the branch name
                    sh 'docker build -t ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME} ./server/Dockerfile .'
                    sh 'docker login -u ${DOCKER_HUB_USERNAME} -p QTpM;eC2#kj2nG*'
                    sh 'docker push ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME}'
                }
            }
        }

        // Stage 2: Deploy Application
        stage('Deploy Application') {
            steps {
                script {
                    // Deploy the Docker image using docker-compose
                    sh """
                        docker pull ${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${BRANCH_NAME}
                        docker-compose -f docker-compose.yml up -d
                    """
                }
            }
        }

        // Stage 3: Build Images (if needed)
        stage('Build Images') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}
