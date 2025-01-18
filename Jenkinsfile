pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
        }

        stage('Unit & Integration Test') {
            steps {
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('server') {
                    script {
                        def scannerHome = tool name: 'sonar'
                        withSonarQubeEnv('sonarQube') {
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=devops_project"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for errors.'
        }
    }
}
