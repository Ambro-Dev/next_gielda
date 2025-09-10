#!/bin/bash

# Docker Compose Management Script
# This script provides easy management of the Next.js Gielda Transport Application in Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker Compose file exists and determine compose command
check_compose_file() {
    if [ ! -f "$COMPOSE_FILE" ]; then
        print_error "Docker Compose file $COMPOSE_FILE not found!"
        exit 1
    fi
    
    # Check for docker compose (newer version) or docker-compose (older version)
    if command -v docker &> /dev/null && docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    elif command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Check if environment file exists
check_env_file() {
    if [ ! -f "$ENV_FILE" ]; then
        print_error "Environment file $ENV_FILE not found!"
        print_status "Please copy env.docker to .env and configure it"
        exit 1
    fi
}

# Start services
start_services() {
    print_status "Starting services..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" up -d
    print_success "Services started"
}

# Stop services
stop_services() {
    print_status "Stopping services..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" down
    print_success "Services stopped"
}

# Restart services
restart_services() {
    print_status "Restarting services..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" restart
    print_success "Services restarted"
}

# Show status
show_status() {
    print_status "Service status:"
    $COMPOSE_CMD -f "$COMPOSE_FILE" ps
    echo
    print_status "Resource usage:"
    docker stats --no-stream
}

# Show logs
show_logs() {
    local service=${1:-""}
    if [ -n "$service" ]; then
        print_status "Showing logs for $service:"
        $COMPOSE_CMD -f "$COMPOSE_FILE" logs -f "$service"
    else
        print_status "Showing logs for all services:"
        $COMPOSE_CMD -f "$COMPOSE_FILE" logs -f
    fi
}

# Update services
update_services() {
    print_status "Updating services..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" pull
    $COMPOSE_CMD -f "$COMPOSE_FILE" up -d --force-recreate
    print_success "Services updated"
}

# Build services
build_services() {
    print_status "Building services..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" build --no-cache
    print_success "Services built"
}

# Create admin user
create_admin() {
    print_status "Creating admin user..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" exec app node scripts/create-admin.js
}

# Test admin setup
test_admin() {
    print_status "Testing admin setup..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" exec app node scripts/test-admin.js
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    $COMPOSE_CMD -f "$COMPOSE_FILE" exec app node scripts/init-production.js
}

# Backup database
backup_database() {
    local backup_name="backup_$(date +%Y%m%d_%H%M%S)"
    print_status "Creating database backup: $backup_name"
    $COMPOSE_CMD -f "$COMPOSE_FILE" exec mongo mongodump --db next_gielda --out "/backups/$backup_name"
    print_success "Database backup created: $backup_name"
}

# Restore database
restore_database() {
    local backup_name=$1
    if [ -z "$backup_name" ]; then
        print_error "Please provide backup name"
        print_status "Available backups:"
        $COMPOSE_CMD -f "$COMPOSE_FILE" exec mongo ls -la /backups/
        exit 1
    fi
    
    print_status "Restoring database from: $backup_name"
    $COMPOSE_CMD -f "$COMPOSE_FILE" exec mongo mongorestore --db next_gielda "/backups/$backup_name/next_gielda"
    print_success "Database restored from: $backup_name"
}

# Clean up
cleanup() {
    print_status "Cleaning up unused Docker resources..."
    docker system prune -f
    print_success "Cleanup completed"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Check if services are running
    if ! $COMPOSE_CMD -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "Some services are not running"
        return 1
    fi
    
    # Check application health endpoint
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_success "Application health check passed"
    else
        print_warning "Application health check failed"
    fi
    
    # Check database connection
    if $COMPOSE_CMD -f "$COMPOSE_FILE" exec mongo mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        print_success "Database health check passed"
    else
        print_warning "Database health check failed"
    fi
}

# Show help
show_help() {
    echo "Docker Compose Management Script"
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo
    echo "Commands:"
    echo "  start                 Start all services"
    echo "  stop                  Stop all services"
    echo "  restart               Restart all services"
    echo "  status                Show service status"
    echo "  logs [SERVICE]        Show logs (optionally for specific service)"
    echo "  update                Update and restart services"
    echo "  build                 Build services"
    echo "  admin                 Create admin user"
    echo "  test-admin            Test admin setup"
    echo "  init-db               Initialize database"
    echo "  backup                Create database backup"
    echo "  restore BACKUP_NAME   Restore database from backup"
    echo "  health                Perform health check"
    echo "  cleanup               Clean up unused Docker resources"
    echo "  help                  Show this help"
    echo
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs app"
    echo "  $0 backup"
    echo "  $0 restore backup_20231201_120000"
}

# Main function
main() {
    local command=${1:-"help"}
    
    case $command in
        start)
            check_compose_file
            check_env_file
            start_services
            ;;
        stop)
            check_compose_file
            stop_services
            ;;
        restart)
            check_compose_file
            check_env_file
            restart_services
            ;;
        status)
            check_compose_file
            show_status
            ;;
        logs)
            check_compose_file
            show_logs "$2"
            ;;
        update)
            check_compose_file
            check_env_file
            update_services
            ;;
        build)
            check_compose_file
            build_services
            ;;
        admin)
            check_compose_file
            create_admin
            ;;
        test-admin)
            check_compose_file
            test_admin
            ;;
        init-db)
            check_compose_file
            init_database
            ;;
        backup)
            check_compose_file
            backup_database
            ;;
        restore)
            check_compose_file
            restore_database "$2"
            ;;
        health)
            check_compose_file
            health_check
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
