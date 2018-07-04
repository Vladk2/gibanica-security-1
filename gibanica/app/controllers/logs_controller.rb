class LogsController < ApplicationController
  skip_before_action :authenticate_user, only: [:create]

  before_action :verify_client_cert, only: [:create]
  before_action :set_agent, only: [:create]
  before_action :verify_agent_authority, only: [:create]
  before_action :set_logs, only: [:index]

  # GET /logs
  def index
    authorize! :read, Log

    render json: @logs,
           status: !@logs.empty? ? :ok : :no_content,
           except: %w[_id logged_date]
  end

  # GET /logs/monthly_status
  def monthly_status
    authorize! :read, Log

    render json: Log.inserted_logs_status('date'), status: :ok
  end

  # GET /logs/host_status
  def host_status
    authorize! :read, Log

    render json: Log.inserted_logs_status('host'), status: :ok
  end

  # GET /logs/system_status
  def system_status
    authorize! :read, Log

    render json: Log.count, status: :ok
  end

  # POST /logs
  def create
    Log.batch_save!(log_params)

    head :ok
  end

  private

  def verify_client_cert
    head :not_acceptable unless request.headers['X-TLS-CLIENT-VERIFIED'] == 'SUCCESS'
  end

  def verify_agent_authority
    head :unauthorized unless @agent.agent.nil?
  end

  def set_agent
    @agent = Agent.find(params[:id])
  end

  def set_logs
    page = params[:page].nil? ? 1 : params[:page]

    if params[:query].nil?
      @logs = {
        data: Log.ascending(:logged_time).page(page),
        count: Log.count,
        page: page
      }
    else
      lazy_col = Log.search(params[:query])
      @logs = {
        data: lazy_col.page(page),
        count: lazy_col.count,
        page: page
      }
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def log_params
    params.permit(:id, logs: %i[host logged_date logged_time process severity message]).require(:logs)
  end
end
